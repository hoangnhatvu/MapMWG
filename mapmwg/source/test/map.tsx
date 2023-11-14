import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Mapbox, {UserLocation} from '@rnmapbox/maps';
import LocateButton from '../components/LocateButton';

import {useSelector, useDispatch} from 'react-redux';
import {setDestination} from '../redux/slices/destinationSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RootState from '../../redux';
import {
  callRoutingAPI,
  searchAddressAPI,
  createRouterLine,
  createRouterLine2,
} from '../services/fetchAPI';
import InstructionModal from '../components/InstructionModal';

const APIKEY =
  'pk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2xvZHIwaWVoMDY2MzJpb2lnOHh1OTI4MiJ9.roagibKOQ4EdGvZaPdIgqg';

Mapbox.setAccessToken(APIKEY);
Mapbox.setWellKnownTileServer('Mapbox');

const MapScreen: React.FC = () => {
  const [isLocated, setIsLocated] = useState<boolean>(false);
  const [instruction, setInstruction] = useState<string>("");
  const [nextInstuct, setNextInstruct] = useState<string>("");

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    106, 11,
  ]);
  const [routeDirection2, setRouteDirection2] = useState<any | null>(null);
  const destination = useSelector(
    (state: RootState) => state.destination.value,
  );
  const dispatch = useDispatch();


  useEffect(() => {
    if (destination && currentLocation) {
      const fetchData = async () => {
        const data = await callRoutingAPI(currentLocation, destination);

        setInstruction(data.Data.features[0].properties.segments[0].steps[0].instruction || "Đi Thẳng");
        setNextInstruct(data.Data.features[0].properties.segments[0].steps[1].instruction || "");
        const route = await createRouterLine2(currentLocation, destination);
        setRouteDirection2(route);
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
          {routeDirection2 && (
            <Mapbox.ShapeSource id="line2" shape={routeDirection2}>
              <Mapbox.LineLayer
                id="routerLine2"
                style={{lineColor: '#213512', lineWidth: 14, lineBlur: 3}}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
      </View>
      <InstructionModal 
        instruction={instruction}
        nextInstruct={nextInstuct}
      />      
      <LocateButton
        isLocated={isLocated}
        onPress={() => {
          isLocated ? setIsLocated(false) : setIsLocated(true);
        }}
      />
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
