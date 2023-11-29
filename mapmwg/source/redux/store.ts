import { configureStore } from '@reduxjs/toolkit';
import searchTextReducer from './slices/searchTextSlice';
import isSearchReducer from './slices/isSearchSlice';
import isSearchBarReducer from './slices/isSearchBarSlice';
import isSearchDirectReducer from './slices/isSearchDirectSlice';
import routeDirectionReducer from './slices/routeDirectionSlide';
import instructionsReducer from './slices/instructionsSlice';
import isDirectedReducer from './slices/isDirectedSlide';
import isLocatedReducer from './slices/isLocatedSlice';
import isInstructedReducer from './slices/isInstructedSlice';
import instructionReducer from './slices/instructionSlice';
import isHandleDirectReducer from './slices/isHandleDirectSlice';
import searchDirectionsReducer from './slices/searchDirectionsSlice';
import transportationReducer from './slices/transportationSlice';

const store = configureStore({
  reducer: {
    searchText: searchTextReducer,
    isSearch: isSearchReducer,
    isSearchBar: isSearchBarReducer,
    isSearchDirect: isSearchDirectReducer,
    isDirected: isDirectedReducer,
    isLocated: isLocatedReducer,
    isInstructed: isInstructedReducer,
    routeDirection: routeDirectionReducer,
    instructions: instructionsReducer,
    instruction: instructionReducer,
    isHandleDirect: isHandleDirectReducer,
    searchDirections: searchDirectionsReducer,
    transportation: transportationReducer,
  },
});

export default store;