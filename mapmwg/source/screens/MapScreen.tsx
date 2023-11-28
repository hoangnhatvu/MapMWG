import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet, View, BackHandler} from 'react-native';
import Mapbox, {
  CircleLayer,
  UserLocationRenderMode as UserLocationRenderModeType,
  UserTrackingMode,
} from '@rnmapbox/maps';
import {
  createMultipleRouterLine,
  createRouterLine,
} from '../services/createRoute';
import SearchScreen from './SearchScreen';
import DirectionScreen from './DirectionScreen';
import BottomSheet from '../components/BottomSheet';
import LocateButton from '../components/LocateButton';
import RootState from '../../redux';
import {callMultipleRoutingAPI, getCoordinatesAPI} from '../services/fetchAPI';
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
  setSearchDirections,
  updateSearchDirection,
} from '../redux/slices/searchDirectionsSlice';

// Init Project
const APIKEY =
  'pk.eyJ1IjoieHVhbmtoYW5ndXllbiIsImEiOiJjbG82bHNjZHUwaXh1MmtuejE1Y242MnlwIn0.nY9LBFNfhj3Rr4eIdmHo1Q';

Mapbox.setAccessToken(APIKEY);
Mapbox.setWellKnownTileServer('Mapbox');

const MapScreen: React.FC = () => {
  // State
  const [initial, setInitial] = useState<boolean>(true);
  const [isLocated, setIsLocated] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    106, 11,
  ]);

  const [isGuided, setIsGuided] = useState<boolean>(false);

  const thresholdDistance = 0.02;

  // Redux
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
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchData = async() => {
  //     const data = await callMultipleRoutingAPI(routes);
  //     console.log("Res: " + JSON.stringify(data.Data.features[0].geometry.coordinates));

  //     dispatch(setRouteDirection(data.Data.features[0].geometry.coordinates));
  //   }

  //   fetchData();
  // }, [])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (destination.value) {
  //       const multiRoutes = await createMultipleRouterLine(
  //         currentLocation,
  //         destination.coordinate,
  //       );
  //       if (multiRoutes !== null) {
  //         setRoutes(multiRoutes);
  //         console.log(routes!.length);
  //         dispatch(setRouteDirection(routes![0]));
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [currentLocation, destination.value]);

  useEffect(() => {
    const delay = 8000;

    const timeoutId = setTimeout(() => {
      setInitial(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isInstructed === true) {
      dispatch(setIsSearchBar(false));
    } else {
      dispatch(setIsSearchBar(true));
    }
  }, [isDirected, isInstructed]);

  useEffect(() => {
    if (routeDirection && searchDirections[1].coordinates !== null) {
      const fetchData = async () => {
        const route = await createRouterLine(
          currentLocation,
          searchDirections[1].coordinates,
        );
        dispatch(setRouteDirection(route));
      };

      fetchData();

      const interval = setInterval(fetchData, 40000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentLocation, searchDirections[1]]);

  const haversine = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Bán kính trái đất tính theo km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Khoảng cách giữa hai điểm

    return distance;
  };

  const toRadians = (degrees: number) => {
    return (degrees * Math.PI) / 180;
  };

  const handleUserLocationUpdate = (location: any) => {
    const {latitude, longitude} = location.coords;
    setCurrentLocation([longitude, latitude]);
    dispatch(updateSearchDirection({id: 0, data: [longitude, latitude]}));

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
    if (newInstruction) {
      dispatch(setInstruction(newInstruction));
    } else {
      dispatch(setInstruction('Đi thẳng'));
    }
  };

  const handleMapPress = async (event: any) => {
    if (isDirected === true || isInstructed === true) {
      return null;
    }

    if (event.geometry) {
      // Get location by click
      const newDestination: [number, number] = [
        event.geometry.coordinates[0],
        event.geometry.coordinates[1],
      ];
      const coords = await getCoordinatesAPI(newDestination);

      dispatch(updateSearchDirection({id: 1, data: coords}));

      dispatch(setRouteDirection(null));
    }
  };

  const handleTouchMove = () => {
    setIsLocated(false);
    setIsGuided(false);
  };

  const handleLocate = () => {
    if (isInstructed) {
      setIsGuided(true);
      return null;
    }
    setIsLocated(!isLocated);
  };

  useEffect(() => {
    if (isInstructed) {
      setIsGuided(true);
    } else {
      setIsGuided(false);
    }
  }, [isInstructed]);

  // Handle backbutton
  useEffect(() => {
    const handleBackButton = () => {
      if (isInstructed) {
        dispatch(setIsInstructed(false));
        dispatch(setRouteDirection(null));
        return true;
      } else if (searchDirections[1].coordinates) {
        dispatch(initDirectionState());
        dispatch(setRouteDirection(null));
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
          {(initial || isLocated) && (
            <Mapbox.Camera
              centerCoordinate={currentLocation}
              animationMode={'flyTo'}
              animationDuration={initial ? 0 : 2000}
              zoomLevel={15}
              followUserMode={UserTrackingMode.FollowWithHeading}
            />
          )}
          {isGuided && (
            <Mapbox.Camera
              centerCoordinate={currentLocation}
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
                  <View>
                  </View>
                </Mapbox.PointAnnotation>
              )
          )}
          <Mapbox.UserLocation
            minDisplacement={10}
            visible={true}
            onUpdate={handleUserLocationUpdate}
            showsUserHeadingIndicator={true}
            animated={true}
            androidRenderMode="gps"
            requestsAlwaysUse={true}
            renderMode={UserLocationRenderModeType.Native}>
            <CircleLayer
              key="customer-user-location-children-red"
              id="customer-user-location-children-red"
              style={{circleColor: 'red', circleRadius: 8}}
            />
          </Mapbox.UserLocation>
          {routeDirection && (
            <Mapbox.ShapeSource id="line" shape={routeDirection}>
              <Mapbox.LineLayer
                id="routerLine"
                style={{lineColor: 'forestgreen', lineWidth: 7, lineBlur: 3}}
              />
            </Mapbox.ShapeSource>
          )}
          {/* {routes && routes.slice(1).map((route, index) => (
              <Mapbox.ShapeSource id={`line${index}`} shape={route}>
                <Mapbox.LineLayer
                  id={`routerLine${index}`}
                  style={{lineColor: 'red', lineWidth: 5, lineBlur: 0}}
                />
              </Mapbox.ShapeSource>
            ))} */}
        </Mapbox.MapView>
      </View>

      <DirectionScreen />
      {isSearch && <SearchScreen />}
      {isSearchBar && <SearchBar />}
      <LocateButton isLocated={isLocated} onPress={handleLocate} />
      {isInstructed && (
        <>
          <InstructionModal instruction={instruction || 'Đi thẳng'} />
          <InstructionSheet
            distance={instructions ? instructions[0].distance : null}
            time={instructions ? instructions[0].duration : null}
          />
        </>
      )}
      {searchDirections[1].coordinates && currentLocation && !isInstructed && (
        <BottomSheet currentLocation={currentLocation} />
      )}
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
});
