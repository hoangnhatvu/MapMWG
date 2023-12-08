import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet, View, BackHandler, ActivityIndicator} from 'react-native';
import Mapbox, {
  Camera,
  UserLocation,
  UserLocationRenderMode as UserLocationRenderModeType,
  UserTrackingMode,
} from '@rnmapbox/maps';
import {createRouterLine, makeRouterFeature} from '../services/createRoute';
import SearchScreen from './SearchScreen';
import DirectionScreen from './DirectionScreen';
import BottomSheet from '../components/BottomSheet';
import LocateButton from '../components/LocateButton';
import RootState from '../../redux';
import {getCoordinatesAPI} from '../services/fetchAPI';
import {setRouteDirection} from '../redux/slices/routeDirectionSlide';
import SearchBar from '../components/SearchBar';
import {setIsDirected} from '../redux/slices/isDirectedSlide';
import InstructionModal from '../components/InstructionModal';
import InstructionSheet from '../components/InstructionSheet';
import {setInstruction} from '../redux/slices/instructionSlice';
import {setIsSearchBar} from '../redux/slices/isSearchBarSlice';
import {setIsInstructed} from '../redux/slices/isInstructedSlice';
import {setIsSearch} from '../redux/slices/isSearchSlice';
import {setSearchText} from '../redux/slices/searchTextSlice';

import {
  initDirectionState,
  updateSearchDirection,
} from '../redux/slices/searchDirectionsSlice';
import {setIsLocated} from '../redux/slices/isLocatedSlice';
import speakText from '../services/textToSpeechService.ts';
import {haversine} from '../utils/haversine';
import {setChosenRouteIndex} from '../redux/slices/chosenRouteSlice';
import {setIsLoading} from '../redux/slices/isLoadingSlice';
import {WINDOW_HEIGHT} from '../utils/window_height';
import {calCoorCenter, calZoom} from '../utils/cameraUtils';
import {useToastMessage} from '../services/toast';
import toast from 'react-native-toast-notifications/lib/typescript/toast';

// Init Project
const APIKEY =
  'pk.eyJ1IjoieHVhbmtoYW5ndXllbiIsImEiOiJjbG82bHNjZHUwaXh1MmtuejE1Y242MnlwIn0.nY9LBFNfhj3Rr4eIdmHo1Q';

Mapbox.setAccessToken(APIKEY);
Mapbox.setWellKnownTileServer('Mapbox');

const MapScreen: React.FC = () => {
  // State
  const [initial, setInitial] = useState<boolean>(true);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    106, 11,
  ]);

  const thresholdDistance = 0.02;

  // Redux
  const isLoading = useSelector((state: RootState) => state.isLoading.value);
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const isSearchBar = useSelector(
    (state: RootState) => state.isSearchBar.value,
  );
  const isDirected = useSelector((state: RootState) => state.isSearch.value);

  const isInstructed = useSelector(
    (state: RootState) => state.isInstructed.value,
  );
  const routeDirection = useSelector(
    (state: RootState) => state.routeDirection.value,
  );
  const instruction = useSelector(
    (state: RootState) => state.instruction.value,
  );
  const instructions = useSelector(
    (state: RootState) => state.instructions.value,
  );
  const searchDirections = useSelector(
    (state: RootState) => state.searchDirections.value,
  );
  const transportation = useSelector(
    (state: RootState) => state.transportation.value,
  );
  const chosenRouteIndex = useSelector(
    (state: RootState) => state.chosenRouteIndex.value,
  );

  const [chosenRoute, setChosenRoute] = useState<any | null>(null);

  const isLocated = useSelector((state: RootState) => state.isLocated.value);
  const dispatch = useDispatch();
  const {showToast} = useToastMessage();

  // Locate when first open app
  useEffect(() => {
    const delay = 8000;

    const timeoutId = setTimeout(() => {
      setInitial(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, []);

  // Searchbar visible
  useEffect(() => {
    if (isInstructed === true) {
      dispatch(setIsSearchBar(false));
    } else {
      dispatch(setIsSearchBar(true));
    }
  }, [isDirected, isInstructed]);

  // choose route
  useEffect(() => {
    if (isInstructed === true && routeDirection) {
      if (chosenRouteIndex >= routeDirection.length) {
        dispatch(setChosenRouteIndex(routeDirection.length));
      }
      setChosenRoute(routeDirection[chosenRouteIndex]);
    } else if (isInstructed === false) {
      setChosenRoute(null);
    }
  }, [isInstructed]);

  // Render route when moving
  useEffect(() => {
    if (!chosenRoute) {
      return;
    }
    const fetchData = async () => {
      const route = await createRouterLine(
        searchDirections[0].coordinates,
        searchDirections[1].coordinates,
        transportation,
      );

      dispatch(setRouteDirection(route));
    };

    fetchData();

    if (routeDirection) {
      if (chosenRouteIndex > routeDirection.length - 1) {
        setChosenRouteIndex(routeDirection.length - 1);
      }
      setChosenRoute(routeDirection[chosenRouteIndex]);
    }
  }, [searchDirections[0]]);

  const handleUserLocationUpdate = async (location: any) => {
    const {latitude, longitude} = location.coords;
    setCurrentLocation([longitude, latitude]);

    dispatch(updateSearchDirection({id: 0, data: [longitude, latitude]}));

    if (routeDirection && searchDirections[1].coordinates !== null) {
      const route = await createRouterLine(
        searchDirections[0].coordinates,
        searchDirections[1].coordinates,
        transportation,
      );
    }
    if (instructions) {
      let minDistance = 1;
      let newInstruction = '';
      if (instructions) {
        for (const step of instructions) {
          if (step?.maneuver?.location) {
            const stepLatitude = step?.maneuver?.location[1];
            const stepLongitude = step?.maneuver?.location[0];

            const distance = haversine(
              latitude,
              longitude,
              stepLatitude,
              stepLongitude,
            );

            if (distance < thresholdDistance) {
              if (distance < minDistance) {
                minDistance = distance;
                newInstruction = step.instruction;
              }
            }
          }
        }
      }
      if (routeDirection) {
        const routes = routeDirection[0]?.features[0]?.geometry?.coordinates;
        const destination = routes[routes.length - 1];
        if (
          haversine(latitude, longitude, destination[1], destination[0]) < 0.015
        ) {
          newInstruction = 'Đã đến';
          speakText(newInstruction);
          dispatch(setIsLocated(true));
          dispatch(setIsInstructed(false));
          dispatch(setIsDirected(false));
          dispatch(initDirectionState());
        }
      }

      if (newInstruction) {
        dispatch(setInstruction(newInstruction));
      } else {
        dispatch(setInstruction('Đi thẳng'));
      }
    }
  };

  const handleMapPress = async (event: any) => {
    if (isDirected === true || isInstructed === true) {
      return null;
    }
    dispatch(setRouteDirection(null));
    if (event.geometry) {
      const newDestination: [number, number] = [
        event.geometry.coordinates[0],
        event.geometry.coordinates[1],
      ];
      try {
        dispatch(setIsLoading({key: 'common', value: true}));
        const coords = await getCoordinatesAPI(newDestination);
        if (coords.object) {
          dispatch(updateSearchDirection({id: 1, data: coords}));
          dispatch(setIsLoading({key: 'common', value: false}));
        } else {
          throw new Error('Chưa có dữ liệu khu vực này !');
        }
      } catch (error) {
        console.log(error);
        toast.show(`${error}`, {
          type: 'danger',
          placement: 'bottom',
          duration: 3000,
          animationType: 'zoom-in',
          style: {borderRadius: 50},
        });
        dispatch(setIsLoading({key: 'common', value: false}));
      }

      dispatch(setRouteDirection(null));
    }
  };

  const handleTouchMove = () => {
    dispatch(setIsLocated(false));
  };

  const handleLocate = () => {
    dispatch(setIsLocated(!isLocated));
  };

  // Handle backbutton
  useEffect(() => {
    const handleBackButton = () => {
      if (isInstructed) {
        dispatch(setIsInstructed(false));
        dispatch(setRouteDirection(null));
        return true;
      } else if (searchDirections[1].coordinates) {
        dispatch(initDirectionState());
        dispatch(updateSearchDirection({id: 0, data: currentLocation}));
        dispatch(setRouteDirection(null));
        dispatch(setSearchText(''));
        return true;
      } else if (isSearch) {
        dispatch(setIsSearch(false));
        dispatch(setSearchText(''));
        return true;
      } else if (isDirected) {
        dispatch(setIsDirected(false));
        dispatch(setRouteDirection(null));
      } else {
        return false;
      }
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [isInstructed, dispatch, isSearch, searchDirections[1].coordinates]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView
          logoEnabled={false}
          style={styles.map}
          styleURL="https://wsmap.tgdd.vn/vector_style/mwg-map-style/osm_liberty.json"
          rotateEnabled={true}
          zoomEnabled={true}
          compassEnabled={true}
          compassFadeWhenNorth={true}
          onPress={handleMapPress}
          onTouchMove={handleTouchMove}>
          {searchDirections[1]?.coordinates && (
            <Mapbox.Camera
              centerCoordinate={searchDirections[1].coordinates}
              animationMode={'flyTo'}
              animationDuration={2000}
              zoomLevel={15}
              pitch={10}
            />
          )}
          {routeDirection &&
            searchDirections[0].coordinates &&
            searchDirections[1].coordinates &&
            !isInstructed && (
              <Mapbox.Camera
                centerCoordinate={calCoorCenter(
                  searchDirections[0].coordinates,
                  searchDirections[1].coordinates,
                )}
                animationMode={'flyTo'}
                animationDuration={2000}
                zoomLevel={calZoom(
                  searchDirections[0].coordinates,
                  searchDirections[1].coordinates,
                )}
                minZoomLevel={10}
                maxZoomLevel={25}
                pitch={10}
                bounds={{
                  ne: searchDirections[0].coordinates,
                  sw: searchDirections[1].coordinates,
                  paddingLeft: 40,
                  paddingRight: 40,
                  paddingTop: 40,
                  paddingBottom: 40,
                }}
              />
            )}
          {(initial || isLocated) && (
            <Mapbox.Camera
              centerCoordinate={currentLocation}
              animationMode={'flyTo'}
              animationDuration={initial ? 0 : 2000}
              zoomLevel={15}
              pitch={0}
              followUserMode={UserTrackingMode.FollowWithHeading}
            />
          )}
          {isInstructed && (
            <Mapbox.Camera
              centerCoordinate={searchDirections[0].coordinates}
              animationMode={'flyTo'}
              animationDuration={2000}
              zoomLevel={18}
              pitch={60}
              followUserMode={UserTrackingMode.FollowWithHeading}
              followHeading={0}
            />
          )}

          {searchDirections.slice(1).map(
            (direction, index) =>
              direction.coordinates !== null && (
                <Mapbox.PointAnnotation
                  id={`destination_${index}`}
                  coordinate={direction.coordinates}>
                  <View></View>
                </Mapbox.PointAnnotation>
              ),
          )}
          <Mapbox.UserLocation
            minDisplacement={50}
            visible={true}
            onUpdate={handleUserLocationUpdate}
            showsUserHeadingIndicator={true}
            animated={true}
            androidRenderMode="gps"
            requestsAlwaysUse={true}
            renderMode={
              UserLocationRenderModeType.Native
            }></Mapbox.UserLocation>
          {isSearchBar &&
            routeDirection?.map((route, index) => {
              return (
              <Mapbox.ShapeSource
                id={`shapeId${index}`}
                key={`shapeKey${index}`}
                shape={routeDirection[index]}>
                <Mapbox.LineLayer
                  id={`routerLine-${index}`}
                  style={{
                    lineColor:
                      index === chosenRouteIndex ? 'forestgreen' : 'gray',
                    lineWidth: index === chosenRouteIndex ? 4 : 2,
                  }}
                />
              </Mapbox.ShapeSource>

              )
            })}
          {isInstructed && chosenRoute && (
            <Mapbox.ShapeSource key={'chosen'} shape={chosenRoute}>
              <Mapbox.LineLayer
                id={`chosen-${chosenRouteIndex}`}
                style={{
                  lineColor: 'forestgreen',
                  lineWidth: 4,
                }}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
      </View>
      <DirectionScreen />
      <LocateButton isLocated={isLocated} onPress={handleLocate} />
      {isSearch && <SearchScreen />}
      {isSearchBar && <SearchBar />}
      {isInstructed && (
        <>
          <InstructionModal instruction={instruction || 'Đi thẳng'} />
          <InstructionSheet
            distance={instructions ? instructions[0].distance : null}
            time={instructions ? instructions[0].duration : null}
          />
        </>
      )}
      {isLoading.common && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={54} color="gray" />
        </View>
      )}
      {searchDirections[1].coordinates &&
        searchDirections[0].coordinates &&
        !isInstructed && <BottomSheet />}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  turn_right: {
    position: 'absolute',
    bottom: '2%',
    right: '5%',
    width: 50,
    height: 50,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  flatList: {
    position: 'absolute',
    alignSelf: 'center',
    top: '13%',
    height: 40,
    width: '80%',
    flex: 1,
  },
  transportationButton: {
    borderRadius: 100,
    borderColor: 'black',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  transportationIcon: {
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    top: WINDOW_HEIGHT / 3,
  },
});
