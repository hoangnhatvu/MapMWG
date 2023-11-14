import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RouteDirectionState {
  value: any | null;
}

const initialState: RouteDirectionState = {
  value: null,
};

const routeDirectionSlice = createSlice({
  name: 'routeDirection',
  initialState,
  reducers: {
    setRouteDirection: (state, action: PayloadAction<[number, number] | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setRouteDirection } = routeDirectionSlice.actions;

export default routeDirectionSlice.reducer;
