import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchDirectionsType {
  id?: number;
  coordinates: [number, number] | any;
  data: any;
}

interface SearchDirectionsState {
  value: SearchDirectionsType[];
}

const initialState: SearchDirectionsState = {
  value: [
    {
      id: 0,
      coordinates: null,
      data: null,
    },
    {
      id: 1,
      coordinates: null,
      data: null,
    },
  ],
};

const searchDirectionsSlice = createSlice({
  name: 'searchDirections',
  initialState,
  reducers: {
    initDirectionState: (state) => {
      state.value = initialState.value;
    },
    setSearchDirections: (state, action: PayloadAction<SearchDirectionsType[]>) => {
      state.value = action.payload;
    },
    addSearchDirection: (state) => { // chi dung khi tim kiem nhieu dia diem
      const newDirection = {        
        id: state.value.length + 1,
        coordinates: null,
        data: null
      };
      state.value = [...state.value, newDirection];
    },
    updateSearchDirection: (state, action: PayloadAction<{ id: number | any; data: any }>) => {
      const { id, data } = action.payload;
      const index = state.value.findIndex((direction) => direction.id === id);

      if (index !== -1) {
        const newValue = {        
          id: id,
          coordinates: data?.geometry?.coordinates || [
            data?.object?.location?.lon,
            data?.object?.location?.lat,
          ] || null,
          data: data
        };

        state.value[index] = newValue;
      }
    },
    removeSearchDirection: (state, action: PayloadAction<number>) => {
      const idToRemove = action.payload;
      state.value = state.value.filter((direction) => direction.id !== idToRemove);
    },
  },
});

export const {
  initDirectionState,
  setSearchDirections,
  addSearchDirection,
  updateSearchDirection,
  removeSearchDirection,
} = searchDirectionsSlice.actions;

export default searchDirectionsSlice.reducer;
