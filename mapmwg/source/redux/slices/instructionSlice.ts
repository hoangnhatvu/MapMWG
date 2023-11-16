import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InstructionState {
  value: string;
}

const initialState: InstructionState = {
  value: "",
};

const instructionSlice = createSlice({
  name: 'instruction',
  initialState,
  reducers: {
    setInstruction: (state, action: PayloadAction<any | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setInstruction } = instructionSlice.actions;

export default instructionSlice.reducer;
