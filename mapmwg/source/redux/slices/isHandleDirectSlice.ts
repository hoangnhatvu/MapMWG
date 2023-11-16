import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsHandleDirectState {
  value: boolean;
}

const initialState: IsHandleDirectState = {
  value: false,
};

const isHandleDirectSlice = createSlice({
  name: 'isHandleDirectSlice',
  initialState,
  reducers: {
    setHandleDirectSlice: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setHandleDirectSlice } = isHandleDirectSlice.actions;

export default isHandleDirectSlice.reducer;
