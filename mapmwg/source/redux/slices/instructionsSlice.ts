import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InstructionsState {
  value: any[];
}

const initialState: InstructionsState = {
  value: [null],
};

const instructionsSlice = createSlice({
  name: 'instructions',
  initialState,
  reducers: {
    setInstructions: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setInstructions } = instructionsSlice.actions;

export default instructionsSlice.reducer;
