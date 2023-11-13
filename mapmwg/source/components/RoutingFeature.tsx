import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Mapbox, TileLayer, LineLayer} from '@rnmapbox/maps';
import GeoJSONSource from '@rnmapbox/maps';

const {width, height} = Dimensions.get('window');

const RoutingFeature: React.FC = () => {
  const [coordinates, setCoordinates] = useState([
    [106.8046183, 10.8454287],
    [106.7690791, 10.8408883],
  ]);
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'http://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/routing?profile=driving-motorcycle',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer 31f755be-5dcb-4c22-aa05-48e95e7bf370',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: coordinates,
            preference: 'fastest',
            continue_straight: true,
            elevation: false,
            units: 'km',
            language: 'vi-vn',
            geometry: true,
            instructions: true,
            instructions_format: 'html',
          }),
        },
      );

      const data = await response.json();
      setRouteData(data);
    };

    fetchData();
  }, [coordinates]);

  if (!routeData) {
    return <View />;
  }

  let routeSource = null;

  if (routeData && routeData.geometry) {
    routeSource = new GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: routeData.geometry.coordinates,
            },
            properties: {
              color: '#007bff',
              width: 5,
            },
          },
        ],
      },
    });
  }

  return (
    <View style={styles.container}>
      <Mapbox
        style={{width: width, height: height}}
        initialCamera={{
          centerCoordinate: coordinates[0],
          zoom: 12,
        }}>
        <TileLayer
          id="satellite"
          url="https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token={YOUR_ACCESS_TOKEN}"
        />
        {routeSource && (
          <GeoJSONSource sourceID="route" geoJSONSource={routeSource} />
        )}
        {routeSource && (
          <LineLayer id="route-line" layerID="route" sourceID="route" />
        )}
      </Mapbox>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RoutingFeature;
