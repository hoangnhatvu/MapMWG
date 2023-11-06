import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, TextInput, Modal} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {primaryColor, tertiaryColor, textColor} from '../constants/color';
import Feather from 'react-native-vector-icons/Feather';
import SearchScreen from './SearchScreen';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {Alert} from 'react-native';
import LocateButton from '../components/LocateButton';

const APIKEY =
  'pk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2xvZHIwaWVoMDY2MzJpb2lnOHh1OTI4MiJ9.roagibKOQ4EdGvZaPdIgqg';

Mapbox.setAccessToken(APIKEY);
Mapbox.setWellKnownTileServer('Mapbox');

const MapScreen: React.FC = () => {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isDirection, setIsDirection] = useState(true);

  const [searchText, setSearchText] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    106, 11,
  ]);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [routeDirection, setRouteDirection] = useState<any | null>(null);
  const handleViewPress = () => {
    Alert.alert('Notification', 'Click on View');
  };

  const memoizedCurrentLocation = useMemo(
    () => currentLocation,
    [currentLocation],
  );
  const [isLocated, setIsLocated] = useState<boolean>(false);

  useEffect(() => {
    if (destination) {
      const fetchData = async () => {
        await createRouterLine(currentLocation, destination);
      };

      fetchData(); // Call the function immediately

      const interval = setInterval(fetchData, 4000); // Call the function every 4 seconds

      return () => {
        clearInterval(interval); // Clear the interval when the component unmounts
      };
    }
  }, [currentLocation, destination]);

  const handleUserLocationUpdate = (location: any) => {
    const {latitude, longitude} = location.coords;
    setCurrentLocation([longitude, latitude]);
  };

  const handleSearch = (event: any): any => {
    setIsSearch(true);
  };

  const exitSearch = (): any => {
    setIsSearch(false);
    setSearchText('');
  };

  function makeRouterFeature(coordinates: [number, number][]): any {
    let routerFeature = {
      type: 'FeatureCollection',
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

  async function createRouterLine(
    startCoords: [number, number],
    endCoords: [number, number],
  ): Promise<void> {
    const startCoordinates = `${startCoords[0]},${startCoords[1]}`;
    const endCoordinates = `${endCoords[0]},${endCoords[1]}`;
    const geometries = 'geojson';
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates};${endCoordinates}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${APIKEY}`;

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
      // Get location by click
      const newDestination: [number, number] = [
        event.geometry.coordinates[0],
        event.geometry.coordinates[1],
      ];
      setDestination(newDestination);

      // Create a new route
      createRouterLine(currentLocation, newDestination);
    }
  };

  const handleSearchResult = (data: [number, number]): any => {
    setIsSearch(false);
    setSearchText('');
    setDestination(data);
    console.log('daa' + data);
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
          onPress={handleMapPress}>
          <Mapbox.Camera
            centerCoordinate={memoizedCurrentLocation}
            zoomLevel={15}
            animationMode={'flyTo'}
            animationDuration={6000}
          />
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
            androidRenderMode="gps"
            animated={true}
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
        {isSearch && (
          <SearchScreen
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearchResult={handleSearchResult}
          />
        )}
      </View>

      <View style={styles.search__bar}>
        {isSearch ? (
          <Feather
            name="arrow-left"
            style={styles.search__bar_icon}
            size={25}
            color="black"
            onPress={exitSearch}
          />
        ) : (
          <Feather
            name="search"
            style={styles.search__bar_icon}
            size={25}
            color="black"
          />
        )}
        <TextInput
          style={styles.search__input}
          placeholder="Search here"
          onKeyPress={handleSearch}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* <TouchableOpacity onPress={handleViewPress}>
        <View style={styles.turn_right}>
          <FontAwesome6 name="diamond-turn-right" size={25} color="white" />
        </View>
      </TouchableOpacity> */}
      <View onTouchStart={handleViewPress} style={styles.turn_right}>
        <FontAwesome6 name="diamond-turn-right" size={25} color="white" />
      </View>
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
  search__bar: {
    width: '80%',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: tertiaryColor,
    backgroundColor: primaryColor,
    alignSelf: 'center',
    top: 50,
    position: 'absolute',
    color: tertiaryColor,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  search__bar_icon: {
    marginLeft: 5,
    marginRight: 5,
  },
  search__input: {
    flex: 1,
    color: textColor,
  },
  turn_right: {
    position: 'absolute',
    bottom: 60,
    right: 18,
    width: 50,
    height: 50,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
