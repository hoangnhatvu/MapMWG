import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsSearchDestinationState {
  value: boolean;
}

const initialState: IsSearchDestinationState = {
  value: false,
};

const isSearchDestinationSlice = createSlice({
  name: 'isSearchDestination',
  initialState,
  reducers: {
    setIsSearchDestination: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIsSearchDestination } = isSearchDestinationSlice.actions;

export default isSearchDestinationSlice.reducer;
