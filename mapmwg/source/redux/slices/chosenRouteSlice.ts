import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChosenRouteIndexState {
  value: number;
}

const initialState: ChosenRouteIndexState = {
  value: 0,
};

const chosenRouteIndexSlice = createSlice({
  name: 'chosenRouteIndex',
  initialState,
  reducers: {
    setChosenRouteIndex: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setChosenRouteIndex } = chosenRouteIndexSlice.actions;

export default chosenRouteIndexSlice.reducer;
