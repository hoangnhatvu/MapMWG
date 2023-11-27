import React, { useEffect, useState } from 'react';
import {Provider} from 'react-redux';
import store from './source/redux/store';

import MapScreen from './source/screens/MapScreen';
import {Platform} from 'react-native';
import Mapbox from '@rnmapbox/maps';

const App: React.FC = () => {
  const [isAndroidPermissionGranted, setIsAndroidPermissionGranted] = useState<boolean>(false);
  const [isFetchingAndroidPermission, setIsFetchingAndroidPermission] = useState<boolean>(true);
  const IS_ANDROID = Platform.OS === 'android';

  useEffect(() => {
    if (IS_ANDROID) {
      (async () => {
        const isGranted = await Mapbox.requestAndroidLocationPermissions();
        setIsAndroidPermissionGranted(isGranted);
        setIsFetchingAndroidPermission(false);
      })();
    } else {
      setIsFetchingAndroidPermission(false);
    }
  }, []);

  if (IS_ANDROID && !isAndroidPermissionGranted) {
    if (isFetchingAndroidPermission ) {
      return null;
    }
  }

  return (
    <Provider store={store}>
        <MapScreen />
    </Provider>
  );
};

export default App;

