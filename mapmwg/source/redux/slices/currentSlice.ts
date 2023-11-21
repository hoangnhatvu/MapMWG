import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentState {
  value: any | null;
}

const initialState: CurrentState = {
  value: null,
};

const currentSlice = createSlice({
  name: 'current',
  initialState,
  reducers: {
    setCurrent: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrent } = currentSlice.actions;

export default currentSlice.reducer;
