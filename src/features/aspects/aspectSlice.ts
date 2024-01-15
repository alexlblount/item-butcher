import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@src/state/store';

interface AspectState {
  selectedAspect: string;
}

const initialState: AspectState = {
  selectedAspect: '',
};

const aspectSlice = createSlice({
  name: 'aspect',
  initialState,
  reducers: {
    setSelectedAspect: (state, action: PayloadAction<string>) => {
      state.selectedAspect = action.payload || '';
    },
  },
});

// Selector to get the selected aspect
const selectSelectedAspect = (state: RootState) => state.aspect.selectedAspect;

// Selector to get items from the vault state
const selectItems = (state: RootState) => state.vault.items;

// Selector to get items that match the selected aspect
export const selectItemsBySelectedAspect = createSelector([selectSelectedAspect, selectItems], (selectedAspect, items) => {
  if (!selectedAspect) return [];
  return items.filter((item) => item.aspect?.type === selectedAspect);
});

export const { setSelectedAspect } = aspectSlice.actions;
export default aspectSlice.reducer;
