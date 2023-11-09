import React from 'react';
import MapScreen from './source/screens/MapScreen';
import {Provider} from 'react-redux';
import store from './source/redux/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MapScreen />        
    </Provider>
  );
};

export default App;
