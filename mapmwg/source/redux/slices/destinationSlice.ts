import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DestinationState {
  value: [number, number] | null;
}

const initialState: DestinationState = {
  value: null,
};

const destinationSlice = createSlice({
  name: 'destination',
  initialState,
  reducers: {
    setDestination: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setDestination } = destinationSlice.actions;

export default destinationSlice.reducer;
