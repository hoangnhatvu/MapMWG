import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentInfoState {
  value: any | null;
}

const initialState: CurrentInfoState = {
  value: null,
};

const currentInfoSlice = createSlice({
  name: 'currentInfo',
  initialState,
  reducers: {
    setCurrentInfo: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrentInfo } = currentInfoSlice.actions;

export default currentInfoSlice.reducer;
