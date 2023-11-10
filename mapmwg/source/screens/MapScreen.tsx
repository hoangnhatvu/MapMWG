import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import LocateButton from '../components/LocateButton';
import {createRouterLine} from '../services/createRoute';
import SearchScreen from './SearchScreen';
import DirectionScreen from './DirectionScreen';
import BottomSheet from '../components/BottomSheet';
import {useSelector, useDispatch} from 'react-redux';
import {setDestination} from '../redux/destinationSlice';
import RootState from '../../redux';

const APIKEY =
  'pk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2xvZHIwaWVoMDY2MzJpb2lnOHh1OTI4MiJ9.roagibKOQ4EdGvZaPdIgqg';

Mapbox.setAccessToken(APIKEY);
Mapbox.setWellKnownTileServer('Mapbox');

const MapScreen: React.FC = () => {
  const [isLocated, setIsLocated] = useState<boolean>(false);
  const [isDirected, setIsDirected] = useState<boolean>(false);

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    106, 11,
  ]);
  const [routeDirection, setRouteDirection] = useState<any | null>(null);
  const destination = useSelector(
    (state: RootState) => state.destination.value,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (destination && currentLocation) {
      const fetchData = async () => {
        const route = await createRouterLine(currentLocation, destination);
        setRouteDirection(route);
      };

      fetchData(); // Call the function immediately

      const interval = setInterval(fetchData, 400000); // Call the function every 4 seconds

      return () => {
        clearInterval(interval); // Clear the interval when the component unmounts
      };
    }
  }, [currentLocation, destination]);

  const handleUserLocationUpdate = (location: any) => {
    const {latitude, longitude} = location.coords;
    setCurrentLocation([longitude, latitude]);
    console.log(currentLocation);
  };

  const handleMapPress = (event: any) => {
    if (event.geometry) {
      // Get location by click
      const newDestination: [number, number] = [
        event.geometry.coordinates[0],
        event.geometry.coordinates[1],
      ];
      dispatch(setDestination(newDestination));
    }
  };

  const handleTouchMove = () => {
    setIsLocated(false);
  };

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
          {isLocated && (
            <Mapbox.Camera
              centerCoordinate={currentLocation}
              animationMode={'flyTo'}
              animationDuration={2000}
              zoomLevel={15}
            />
          )}

          {destination && (
            <Mapbox.PointAnnotation id="marker" coordinate={destination}>
              <View></View>
            </Mapbox.PointAnnotation>
          )}
          <Mapbox.UserLocation
            minDisplacement={1}
            visible={true}
            onUpdate={handleUserLocationUpdate}
            showsUserHeadingIndicator={true}
            animated={true}
            androidRenderMode="gps"
            requestsAlwaysUse={true}
          />
          {routeDirection && (
            <Mapbox.ShapeSource id="line" shape={routeDirection}>
              <Mapbox.LineLayer
                id="routerLine"
                style={{lineColor: 'blue', lineWidth: 6}}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
        <SearchScreen />
      </View>

      <LocateButton
        isLocated={isLocated}
        onPress={() => {
          isLocated ? setIsLocated(false) : setIsLocated(true);
        }}
      />

      <DirectionScreen />
      <BottomSheet />
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
