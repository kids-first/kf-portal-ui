import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getNotebookClusterManifest } from './thunks';
import { initialState } from './types';

export const NotebookState: initialState = {
  isLoading: false,
};

const notebookSlice = createSlice({
  name: 'notebook',
  initialState: NotebookState,
  reducers: {
    toggleLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
    reset: () => ({
      ...NotebookState,
    }),
    resetError: (state) => ({
      ...state,
      error: null,
    }),
  },
  extraReducers: (builder) => {
    // START cluster
    builder.addCase(getNotebookClusterManifest.pending, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    }));
    builder.addCase(getNotebookClusterManifest.fulfilled, (state) => ({
      ...state,
      isLoading: false,
    }));
    builder.addCase(getNotebookClusterManifest.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isLoading: false,
    }));
  },
});

export const notebookActions = notebookSlice.actions;
export default notebookSlice.reducer;
