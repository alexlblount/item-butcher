import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AspectState {
  selectedAspect: string | null;
}

const initialState: AspectState = {
  selectedAspect: null,
};

const aspectSlice = createSlice({
  name: 'aspect',
  initialState,
  reducers: {
    setSelectedAspect: (state, action: PayloadAction<string>) => {
      state.selectedAspect = action.payload;
    },
  },
});

export const { setSelectedAspect } = aspectSlice.actions;
export default aspectSlice.reducer;
