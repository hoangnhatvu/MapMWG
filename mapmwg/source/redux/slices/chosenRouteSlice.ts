import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChosenRouteState {
  value: number;
}

const initialState: ChosenRouteState = {
  value: 0,
};

const chosenRouteSlice = createSlice({
  name: 'chosenRoute',
  initialState,
  reducers: {
    setChosenRoute: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setChosenRoute } = chosenRouteSlice.actions;

export default chosenRouteSlice.reducer;
