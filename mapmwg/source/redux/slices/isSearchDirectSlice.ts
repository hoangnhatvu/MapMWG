import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsSearchDirectState {
  value: boolean;
}

const initialState: IsSearchDirectState = {
  value: false,
};

const isSearchDirectSlice = createSlice({
  name: 'isSearchDirect',
  initialState,
  reducers: {
    setIsSearchDirect: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsSearchDirect } = isSearchDirectSlice.actions;

export default isSearchDirectSlice.reducer;
