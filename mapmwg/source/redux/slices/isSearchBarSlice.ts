import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsSearchBarState {
  value: boolean;
}

const initialState: IsSearchBarState = {
  value: true,
};

const isSearchBarSlice = createSlice({
  name: 'isSearchBar',
  initialState,
  reducers: {
    setIsSearchBar: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsSearchBar } = isSearchBarSlice.actions;

export default isSearchBarSlice.reducer;
