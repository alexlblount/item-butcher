import { createSlice } from '@reduxjs/toolkit';
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
    // test reducers
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { addItem, increment, decrement, incrementByAmount } =
  vaultSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.vault.value;

export default vaultSlice.reducer;
