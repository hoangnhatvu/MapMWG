import React, {useState, useEffect} from 'react';
import {Feature, Layer} from '@rnmapbox/maps';

const Map = ReactMapboxGl({
  accessToken: 'YOUR_ACCESS_TOKEN',
});

const MapboxCamera = () => {
  const [mapRotation, setMapRotation] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const handleLocationChange = event => {
      const {latitude, longitude} = event.coords;
      setUserLocation([longitude, latitude]);
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(handleLocationChange);
    }

    // Hủy bỏ sự theo dõi khi component bị hủy
    return () => {
      navigator.geolocation.clearWatch(handleLocationChange);
    };
  }, []);

  const handleRotationChange = () => {
    if (userLocation) {
      const [longitude, latitude] = userLocation;
      const bearing =
        -Math.atan2(
          map.getCenter().lat - latitude,
          map.getCenter().lng - longitude,
        ) *
        (180 / Math.PI);
      setMapRotation(bearing);
    }
  };

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v11"
      zoom={[15]}
      containerStyle={{
        height: '100vh',
        width: '100vw',
      }}
      onMove={handleRotationChange}>
      <Layer type="symbol" id="marker" layout={{'icon-image': 'marker-15'}}>
        {userLocation && <Feature coordinates={userLocation} />}
      </Layer>
    </Map>
  );
};

export default MapboxCamera;
