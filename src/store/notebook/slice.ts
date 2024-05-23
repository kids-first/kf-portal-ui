import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NotebookApiStatus } from 'services/api/notebook/model';

import { getNotebookClusterManifest } from './thunks';
import { initialState } from './types';

export const NotebookState: initialState = {
  isLoading: false,
  url: '',
  status: NotebookApiStatus.unverified,
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
      status: NotebookApiStatus.createInProgress,
      error: null,
    }));
    builder.addCase(getNotebookClusterManifest.fulfilled, (state) => ({
      ...state,
      isLoading: false,
    }));
    builder.addCase(getNotebookClusterManifest.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      status: NotebookApiStatus.unverified,
      isLoading: false,
    }));
  },
});

export const notebookActions = notebookSlice.actions;
export default notebookSlice.reducer;
