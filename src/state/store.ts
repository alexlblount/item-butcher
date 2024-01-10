import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import vaultReducer from '../features/vault/vaultSlice';

export const store = configureStore({
  reducer: {
    vault: vaultReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
