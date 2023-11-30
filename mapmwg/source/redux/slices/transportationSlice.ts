import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransportationState {
  value: string;
}

const initialState: TransportationState = {
  value: 'hgv',
};

const transportationSlice = createSlice({
  name: 'transportation',
  initialState,
  reducers: {
    setTransportation: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setTransportation } = transportationSlice.actions;

export default transportationSlice.reducer;