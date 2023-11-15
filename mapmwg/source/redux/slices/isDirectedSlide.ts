import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsDirectedState {
  value: boolean;
}

const initialState: IsDirectedState = {
  value: false,
};

const isDirectedSlice = createSlice({
  name: 'isDirected',
  initialState,
  reducers: {
    setIsDirected: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsDirected } = isDirectedSlice.actions;

export default isDirectedSlice.reducer;
