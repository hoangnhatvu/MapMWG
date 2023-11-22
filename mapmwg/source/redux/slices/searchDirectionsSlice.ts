import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchDirectionsType {
  id?: number | any;
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
    addSearchDirection: (state) => {
      const newDirection = {        
        id: state.value.length + 1,
        placeHolder: "Chọn điểm đến",
        data: null
      };
      state.value = [...state.value, newDirection];
    },
    updateSearchDirection: (state, action: PayloadAction<{ id: number | any; data: any }>) => {
      const { id, data } = action.payload;
      const index = state.value.findIndex((direction) => direction.id === id);
      console.log(index)

      if (index !== -1) {
        state.value[index].data = data;
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
