import { configureStore } from '@reduxjs/toolkit';
import destinationReducer from './destinationSlice';

const store = configureStore({
  reducer: {
    destination: destinationReducer,
  },
});

export default store;