import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchDirectionsType {
  id?: number;
  placeHolder?: string;
  data: any;
}

interface SearchDirectionsState {
  value: SearchDirectionsType[];
}

const initialState: SearchDirectionsState = {
  value: [
    {
      id: 1,
      placeHolder: 'Vị trí của bạn',
      data: null,
    },
    {
      id: 2,
      placeHolder: 'Chọn điểm đến',
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
    addSearchDirection: (state, action: PayloadAction<{ data: any }>) => {
      const newDirection = {
        ...action.payload,
        id: state.value.length + 1,
        placeHolder: "Chọn điểm đến",
      };
      state.value = [...state.value, newDirection];
    },
    updateSearchDirectionData: (state, action: PayloadAction<{ id: number; data: any }>) => {
      const { id, data } = action.payload;
      const index = state.value.findIndex((direction) => direction.id === id);

      if (index !== -1) {
        state.value[index] = { ...state.value[index], data };
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
  updateSearchDirectionData,
  removeSearchDirection,
} = searchDirectionsSlice.actions;

export default searchDirectionsSlice.reducer;
