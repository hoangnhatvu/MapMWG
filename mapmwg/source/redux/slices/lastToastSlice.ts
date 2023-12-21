import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LastToastState {
  value: string;
}

const initialState: LastToastState = {
  value: '',
};

const lastToastSlice = createSlice({
  name: 'lastToast',
  initialState,
  reducers: {
    setLastToast: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setLastToast } = lastToastSlice.actions;

export default lastToastSlice.reducer;
