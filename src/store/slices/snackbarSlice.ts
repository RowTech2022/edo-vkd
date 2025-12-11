import { createSlice } from '@reduxjs/toolkit'

interface IError {
  message: string | null
}

interface ISnackbarState {
  error: IError | null
  mode: null | 'light' | 'dark'
  notificationOpen: boolean

}

const initialState = { error: null } as ISnackbarState

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    addError(state, action) {
      const { error } = action.payload
      state.error = error
      return state
    },
    setMode(state, action) {
      state.mode = action.payload
    },
    handleOpenOrClose(state, action) {
      state.notificationOpen = action.payload
    }
  },
})

export const { addError , setMode , handleOpenOrClose } = snackbarSlice.actions
export default snackbarSlice.reducer
