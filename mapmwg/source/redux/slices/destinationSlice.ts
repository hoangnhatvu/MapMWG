import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DestinationState {
  coordinate: [number, number] | any;
  value: any | null;
}

const initialState: DestinationState = {
  coordinate: null,
  value: null,
};

const destinationSlice = createSlice({
  name: 'destination',
  initialState,
  reducers: {
    setDestination: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
      state.coordinate = action.payload?.geometry?.coordinates || [
        action.payload?.object?.location?.lon,
        action.payload?.object?.location?.lat,
      ] || null;
    },
  },
});

export const { setDestination } = destinationSlice.actions;

export default destinationSlice.reducer;
