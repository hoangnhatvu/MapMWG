import { configureStore } from '@reduxjs/toolkit';
import destinationReducer from './slices/destinationSlice';
import currentReducer from './slices/currentSlice';
import searchTextReducer from './slices/searchTextSlice';
import isSearchReducer from './slices/isSearchSlice';
import isSearchBarReducer from './slices/isSearchBarSlice';
import isSearchDirectReducer from './slices/isSearchDirectSlice';
import routeDirectionReducer from './slices/routeDirectionSlide';
import instructionsReducer from './slices/instructionsSlice';
import isDirectedReducer from './slices/isDirectedSlide';
import isInstructedReducer from './slices/isInstructedSlice';
import instructionReducer from './slices/instructionSlice';
import isHandleDirectReducer from './slices/isHandleDirectSlice';
import searchDirectionsReducer from './slices/searchDirectionsSlice'

const store = configureStore({
  reducer: {
    destination: destinationReducer,
    current: currentReducer,
    searchText: searchTextReducer,
    isSearch: isSearchReducer,
    isSearchBar: isSearchBarReducer,
    isSearchDirect: isSearchDirectReducer,
    isDirected: isDirectedReducer,
    isInstructed: isInstructedReducer,
    routeDirection: routeDirectionReducer,
    instructions: instructionsReducer,
    instruction: instructionReducer,
    isHandleDirect: isHandleDirectReducer,
    searchDirections: searchDirectionsReducer,
  },
});

export default store;