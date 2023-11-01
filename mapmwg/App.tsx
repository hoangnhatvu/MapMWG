import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Mapbox from '@rnmapbox/maps';

const APIKEY = 'pk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2xvZHIwaWVoMDY2MzJpb2lnOHh1OTI4MiJ9.roagibKOQ4EdGvZaPdIgqg';

Mapbox.setAccessToken(APIKEY);
Mapbox.setWellKnownTileServer('Mapbox');

const App: React.FC = () => {
  const [destination, setDestination] = useState<[number, number]>([106.7961, 10.89]);
  const [routeDirection, setRouteDirection] = useState<any | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([106, 11]);
  const [locationLoaded, setLocationLoaded] = useState(true);

  useEffect(() => {
    Mapbox.requestAndroidLocationPermissions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await createRouterLine(currentLocation, destination);
    };
  
    fetchData(); // Call the function immediately
  
    const interval = setInterval(fetchData, 1000); // Call the function every 3 seconds
  
    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, [currentLocation, destination]);

  const handleUserLocationUpdate = (location: any) => {
    const { latitude, longitude } = location.coords;
    setCurrentLocation([longitude, latitude]);
  };


  function makeRouterFeature(coordinates: [number, number][]): any {
    let routerFeature = {
      type: "FeatureCollection",
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      ],
    };
    return routerFeature;
  }

  async function createRouterLine(startCoords: [number, number], endCoords: [number, number]): Promise<void> {
    const startCoordinates = `${startCoords[0]},${startCoords[1]}`;
    const endCoordinates = `${endCoords[0]},${endCoords[1]}`;
    const geometries = 'geojson';
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates};${endCoordinates}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${APIKEY}`;
    console.log("url: " + url);

    try {
      let response = await fetch(url);
      let json = await response.json();
      let coordinates = json.routes[0].geometry.coordinates;

      if (coordinates.length) {
        const routerFeature = makeRouterFeature([...coordinates]);
        setRouteDirection(routerFeature);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleMapPress = (event: any) => {
    if (event.geometry) {
      // Lấy tọa độ điểm đến từ sự kiện click
      const newDestination: [number, number] = [event.geometry.coordinates[0], event.geometry.coordinates[1]];
      setDestination(newDestination);

      // Tạo tuyến đường mới
      createRouterLine(currentLocation, newDestination);
    }
  };

  return (
    <View style={styles.page}>
      {locationLoaded && (
        <Mapbox.MapView
          style={styles.map}
          styleURL='mapbox://styles/mapbox/outdoors-v12'
          rotateEnabled={true}
          zoomEnabled={true}
          onPress={handleMapPress}
          onUserLocationUpdate={async() => createRouterLine(currentLocation, destination)}
        >
          <Mapbox.Camera
            centerCoordinate={currentLocation}
            zoomLevel={15}
            animationMode={'flyTo'}
            animationDuration={6000}
          />
          <Mapbox.PointAnnotation id="marker" coordinate={destination}>
            <View></View>
          </Mapbox.PointAnnotation>
          <Mapbox.UserLocation 
            minDisplacement={1}
            visible={true}
            onUpdate={handleUserLocationUpdate}            
            showsUserHeadingIndicator={true}
            androidRenderMode='gps'
            animated={true}
          />
          {routeDirection && (
            <Mapbox.ShapeSource
              id='line'
              shape={routeDirection}
            >
              <Mapbox.LineLayer id="routerLine" style={{ lineColor: "blue", lineWidth: 6 }} />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1
  }
});
