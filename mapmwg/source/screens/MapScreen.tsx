import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Mapbox, {
  CircleLayer,
  UserLocationRenderMode as UserLocationRenderModeType,
  UserTrackingMode,
} from '@rnmapbox/maps';
import LocateButton from '../components/LocateButton';
import {createRouterLine} from '../services/createRoute';
import SearchScreen from './SearchScreen';
import DirectionScreen from './DirectionScreen';
import BottomSheet from '../components/BottomSheet';
import {useSelector, useDispatch} from 'react-redux';
import {setDestination} from '../redux/slices/destinationSlice';
import RootState from '../../redux';
import {callRoutingAPI, getCoordinatesAPI} from '../services/fetchAPI';
import {setRouteDirection} from '../redux/slices/routeDirectionSlide';
import {setInstructions} from '../redux/slices/instructionsSlice';
import SearchBar from '../components/SearchBar';
import {setIsDirected} from '../redux/slices/isDirectedSlide';
import InstructionModal from '../components/InstructionModal';
import InstructionSheet from '../components/InstructionSheet';
import {setInstruction} from '../redux/slices/instructionSlice';
import DirectionButton from '../components/DirectionButton';
import {setIsSearchBar} from '../redux/slices/isSearchBarSlice';
import {getDistance} from '../helps/get_distance';

const APIKEY =
  'pk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2xvZHIwaWVoMDY2MzJpb2lnOHh1OTI4MiJ9.roagibKOQ4EdGvZaPdIgqg';

Mapbox.setAccessToken(APIKEY);
Mapbox.setWellKnownTileServer('Mapbox');

const MapScreen: React.FC = () => {
  // State
  const [initial, setInitial] = useState<boolean>(true);
  const [isLocated, setIsLocated] = useState<boolean>(false);
  const [address, setAddress] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showsUserHeadingIndicator, setShowsUserHeadingIndicator] =
    useState(true);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    106, 11,
  ]);

  const thresholdDistance = 0.02;

  // Redux
  const isSearch = useSelector((state: RootState) => state.isSearch.value);
  const isSearchBar = useSelector(
    (state: RootState) => state.isSearchBar.value,
  );
  const isDirected = useSelector((state: RootState) => state.isSearch.value);
  const currentInfo = useSelector(
    (state: RootState) => state.currentInfo.value,
  );
  const destinationInfo = useSelector(
    (state: RootState) => state.destinationInfo.value,
  );
  const isInstructed = useSelector(
    (state: RootState) => state.isInstructed.value,
  );
  const isHandleDirect = useSelector(
    (state: RootState) => state.isHandleDirect.value,
  );
  const routeDirection = useSelector(
    (state: RootState) => state.routeDirection.value,
  );
  const instruction = useSelector(
    (state: RootState) => state.instruction.value,
  );
  const current = useSelector((state: RootState) => state.destination.value);
  const destination = useSelector(
    (state: RootState) => state.destination.value,
  );
  const instructions = useSelector(
    (state: RootState) => state.instructions.value,
  );
  const isSearchCurrent = useSelector(
    (state: RootState) => state.isSearchCurrent.value,
  );
  const isSearchDestination = useSelector(
    (state: RootState) => state.isSearchDestination.value,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const delay = 4000;

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
    if (routeDirection && destination) {
      const fetchData = async () => {
        const route = await createRouterLine(currentLocation, destination);
        dispatch(setRouteDirection(route));
      };

      fetchData();

      const interval = setInterval(fetchData, 400000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [routeDirection]);

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
    console.log(newInstruction);
    if (newInstruction) {
      dispatch(setInstruction(newInstruction));
    } else {
      dispatch(setInstruction('Đi thẳng'));
    }
  };

  const handleMapPress = async (event: any) => {
    if (event.geometry) {
      // Get location by click
      const newDestination: [number, number] = [
        event.geometry.coordinates[0],
        event.geometry.coordinates[1],
      ];
      dispatch(setDestination(newDestination));

      const coords = await getCoordinatesAPI(newDestination);
      setAddress(coords);

      const route = await callRoutingAPI(currentLocation, newDestination);
      dispatch(
        setInstructions(
          route.Data?.features[0]?.properties?.segments[0]?.steps,
        ),
      );
      setDistance(route.Data.features[0].properties.summary.distance);
      dispatch(setIsDirected(true));
      dispatch(setRouteDirection(null));
    }
  };

  const handleTouchMove = () => {
    setIsLocated(false);
  };

  useEffect(() => {}, [instructions]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView
          logoEnabled={false}
          style={styles.map}
          styleURL="mapbox://styles/mapbox/outdoors-v12"
          rotateEnabled={true}
          zoomEnabled={true}
          compassEnabled={true}
          compassFadeWhenNorth={true}
          onPress={handleMapPress}
          onTouchMove={handleTouchMove}>
          {destination && (
            <Mapbox.Camera
              centerCoordinate={destination}
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
              animationDuration={2000}
              zoomLevel={15}
              followUserMode={UserTrackingMode.FollowWithHeading}
            />
          )}
          {isInstructed && (
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

          {destination && (
            <Mapbox.PointAnnotation id="marker" coordinate={destination}>
              <View></View>
            </Mapbox.PointAnnotation>
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
                style={{lineColor: '#00B0FF', lineWidth: 7, lineBlur: 3}}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
      </View>

      <DirectionScreen />
      {isSearch && <SearchScreen />}
      {isSearchBar && <SearchBar />}
      <LocateButton
        isLocated={isLocated}
        onPress={() => {
          isLocated ? setIsLocated(false) : setIsLocated(true);
        }}
      />
      {isInstructed && (
        <>
          <InstructionModal instruction={instruction} />
          <InstructionSheet
            distance={instructions[0].distance}
            time={instructions[0].duration}
          />
        </>
      )}
      {destination && !isInstructed && (
        <BottomSheet
          name={
            destinationInfo
              ? destinationInfo?.properties?.searchName
              : address?.object?.searchName || 'Chưa có dữ liệu trên hệ thống'
          }
          address={
            destinationInfo
              ? destinationInfo?.properties?.searchAddress
              : address?.object?.searchAddress ||
                'Chưa có dữ liệu trên hệ thống'
          }
          distance={destinationInfo ? getDistance() : distance || 0}
          currentLocation={currentInfo ? current : currentLocation}
        />
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
