import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsLocatedState {
  value: boolean;
}

const initialState: IsLocatedState = {
  value: false,
};

const isLocatedSlice = createSlice({
  name: 'isLocated',
  initialState,
  reducers: {
    setIsLocated: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsLocated } = isLocatedSlice.actions;

export default isLocatedSlice.reducer;
