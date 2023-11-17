import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentState {
  value: [number, number] | any;
}

const initialState: CurrentState = {
  value: null,
};

const currentSlice = createSlice({
  name: 'current',
  initialState,
  reducers: {
    setCurrent: (state, action: PayloadAction<[number, number]>) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrent } = currentSlice.actions;

export default currentSlice.reducer;
