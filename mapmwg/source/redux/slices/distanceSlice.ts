import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DistanceState {
  value: number;
}

const initialState: DistanceState = {
  value: 0,
};

const distanceSlice = createSlice({
  name: 'distance',
  initialState,
  reducers: {
    setDistance: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setDistance } = distanceSlice.actions;

export default distanceSlice.reducer;
