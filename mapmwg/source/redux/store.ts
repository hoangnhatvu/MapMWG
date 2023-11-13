import { configureStore } from '@reduxjs/toolkit';
import destinationReducer from './slices/destinationSlice';
import searchTextReducer from './slices/searchTextSlice';
import isSearchReducer from './slices/isSearchSlice';
import routeDirectionReducer from './slices/routeDirectionSlide';

const store = configureStore({
  reducer: {
    destination: destinationReducer,
    searchText: searchTextReducer,
    isSearch: isSearchReducer,
    routeDirection: routeDirectionReducer,
  },
});

export default store;