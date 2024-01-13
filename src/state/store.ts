import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// aliased
import aspectReducer from '@features/aspects/aspectSlice';
import vaultReducer from '@features/vault/vaultSlice';

export const store = configureStore({
  reducer: {
    aspect: aspectReducer,
    vault: vaultReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
