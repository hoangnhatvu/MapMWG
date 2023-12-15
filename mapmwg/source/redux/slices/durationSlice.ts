import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DurationState {
  value: number;
}

const initialState: DurationState = {
  value: 0,
};

const durationSlice = createSlice({
  name: 'duration',
  initialState,
  reducers: {
    setDuration: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setDuration } = durationSlice.actions;

export default durationSlice.reducer;
