import React from 'react';
import {Provider} from 'react-redux';
import store from './source/redux/store';

import MapScreen from './source/screens/MapScreen';
<<<<<<< HEAD
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MapScreen />
=======
import {View} from 'react-native';

const App: React.FC = () => {
  return (
    <Provider store={store}>
        <MapScreen />

>>>>>>> 94c029ce1488fe05a30aeb5a7fb1a8e3a4a8cbb8
    </Provider>
  );
};

export default App;
