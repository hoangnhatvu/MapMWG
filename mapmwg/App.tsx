import React from 'react';
import {Provider} from 'react-redux';
import store from './source/redux/store';
import MapScreen from './source/screens/MapScreen';


const App: React.FC = () => {

  return (
    <Provider store={store}>
      <MapScreen />        
    </Provider>
  );
};

export default App;
