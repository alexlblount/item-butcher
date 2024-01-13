import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@src/state/store';
import type { Item } from '@features/imageParsing/transformText';

// Define a type for the slice state
interface vaultState {
  value: number;
  items: Item[];
}

// Define the initial state using that type
const initialState: vaultState = {
  value: 0,
  items: [],
};

export const vaultSlice = createSlice({
  name: 'vault',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      state.items.splice(index, 1);
    },
    // Add other reducers as needed
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

// state selectors
const selectItems = (state: RootState) => state.vault.items;

// Selector to get unique, sorted itemTypes
export const selectUniqueSortedItemTypes = createSelector([selectItems], (items) => {
  const itemTypes = items.map((item) => item.itemType);
  const uniqueItemTypes = Array.from(new Set(itemTypes));
  uniqueItemTypes.sort();
  return uniqueItemTypes;
});

// Selector to get unique aspect types
export const selectLegendaryAspectTypes = createSelector([selectItems], (items) => {
  const allTypes = items
    .filter((item) => item.rarity === 'Legendary')
    .map((item) => item.aspect?.type)
    .filter((type): type is string => !!type);
  console.log({ allTypes });
  return Array.from(new Set(allTypes));
});

export const { addItem, deleteItem, updateItem } = vaultSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.vault.value;

export default vaultSlice.reducer;
