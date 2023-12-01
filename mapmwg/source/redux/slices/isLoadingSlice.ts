import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IsLoadingState {
  value: {
    common: boolean;
    search: boolean;
    bottom_sheet: boolean;
    instruction: boolean;
  };
}

const initialState: IsLoadingState = {
  value: {
    common: false,
    search: false,
    bottom_sheet: false,
    instruction: false,
  },
};

const isLoadingSlice = createSlice({
  name: 'isLoading',
  initialState,
  reducers: {
    setIsLoading: (
      state,
      action: PayloadAction<{
        key: keyof IsLoadingState['value'];
        value: boolean;
      }>,
    ) => {
      state.value[action.payload.key] = action.payload.value;
    },
  },
});

export const {setIsLoading} = isLoadingSlice.actions;

export default isLoadingSlice.reducer;
