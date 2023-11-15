import { configureStore } from '@reduxjs/toolkit';
import destinationReducer from './slices/destinationSlice';
import searchTextReducer from './slices/searchTextSlice';
import isSearchReducer from './slices/isSearchSlice';
import routeDirectionReducer from './slices/routeDirectionSlide';
import instructionsReducer from './slices/instructionsSlice';
import isDirectedReducer from './slices/isDirectedSlide';
import isInstructedReducer from './slices/isInstructedSlice';

const store = configureStore({
  reducer: {
    destination: destinationReducer,
    searchText: searchTextReducer,
    isSearch: isSearchReducer,
    isDirected: isDirectedReducer,
    isInstructed: isInstructedReducer,
    routeDirection: routeDirectionReducer,
    instructions: instructionsReducer,
  },
});

export default store;