import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AddressState {
  value: any;
}

const initialState: AddressState = {
  value: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setAddress } = addressSlice.actions;

export default addressSlice.reducer;
