import { configureStore } from '@reduxjs/toolkit';
import destinationReducer from './slices/destinationSlice';
import searchTextReducer from './slices/searchTextSlice';
import isSearchReducer from './slices/isSearchSlice';

const store = configureStore({
  reducer: {
    destination: destinationReducer,
    searchText: searchTextReducer,
    isSearch: isSearchReducer,
  },
});

export default store;