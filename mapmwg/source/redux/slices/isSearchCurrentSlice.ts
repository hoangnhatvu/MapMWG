import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsSearchCurrentState {
  value: boolean;
}

const initialState: IsSearchCurrentState = {
  value: false,
};

const isSearchCurrentSlice = createSlice({
  name: 'isSearchCurrent',
  initialState,
  reducers: {
    setIsSearchCurrent: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsSearchCurrent } = isSearchCurrentSlice.actions;

export default isSearchCurrentSlice.reducer;
