import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DestinationInfoState {
  value: any | null;
}

const initialState: DestinationInfoState = {
  value: null,
};

const destinationInfoSlice = createSlice({
  name: 'destinationInfo',
  initialState,
  reducers: {
    setDestinationInfo: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export const { setDestinationInfo } = destinationInfoSlice.actions;

export default destinationInfoSlice.reducer;
