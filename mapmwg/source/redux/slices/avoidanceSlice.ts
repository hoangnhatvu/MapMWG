import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AvoidanceState {
  value: string[];
}

const initialState: AvoidanceState = {
  value: [],
};

const avoidanceSlice = createSlice({
  name: 'avoidance',
  initialState,
  reducers: {
    setAvoidance: (state, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setAvoidance } = avoidanceSlice.actions;

export default avoidanceSlice.reducer;
