import { configureStore, Store } from '@reduxjs/toolkit'
import snackbarReducers from './slices/snackbarSlice'
import { api } from '@services/api'

export const store: Store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    snackbar: snackbarReducers,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(api.middleware)
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {}
export type AppDispatch = typeof store.dispatch
