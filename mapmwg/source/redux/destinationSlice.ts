// destinationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DestinationState {
  value: [number, number];
}

const initialState: DestinationState = {
  value: [0, 0], // Giá trị mặc định ban đầu
};

const destinationSlice = createSlice({
  name: 'destination',
  initialState,
  reducers: {
    setDestination: (state, action: PayloadAction<[number, number]>) => {
      state.value = action.payload;
    },
  },
});

export const { setDestination } = destinationSlice.actions;

export default destinationSlice.reducer;
