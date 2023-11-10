import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsSearchState {
  value: boolean;
}

const initialState: IsSearchState = {
  value: false,
};

const isSearchSlice = createSlice({
  name: 'isSearch',
  initialState,
  reducers: {
    setIsSearch: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsSearch } = isSearchSlice.actions;

export default isSearchSlice.reducer;
