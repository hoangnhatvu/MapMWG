import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsInstructedState {
  value: boolean;
}

const initialState: IsInstructedState = {
  value: false,
};

const isInstructedSlice = createSlice({
  name: 'isInstructed',
  initialState,
  reducers: {
    setIsInstructed: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsInstructed } = isInstructedSlice.actions;

export default isInstructedSlice.reducer;
