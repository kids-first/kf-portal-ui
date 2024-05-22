import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NotebookApiStatus } from 'services/api/notebook/model';

import {
  getNotebookClusterManifest,
  getNotebookClusterStatus,
  stopNotebookCluster,
} from './thunks';
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
    // GET cluster
    builder.addCase(getNotebookClusterStatus.pending, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    }));
    builder.addCase(getNotebookClusterStatus.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      status: action.payload.status,
      url: action.payload.url!,
    }));
    builder.addCase(getNotebookClusterStatus.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      status: NotebookApiStatus.unverified,
      isLoading: false,
    }));
    // STOP cluster
    builder.addCase(stopNotebookCluster.pending, (state) => ({
      ...state,
      isLoading: true,
      status: NotebookApiStatus.deleteInProgress,
      url: '',
      error: null,
    }));
    builder.addCase(stopNotebookCluster.fulfilled, (state) => ({
      ...state,
      isLoading: true,
      status: NotebookApiStatus.deleteInProgress,
      url: '',
    }));
    builder.addCase(stopNotebookCluster.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      status: NotebookApiStatus.createComplete,
      isLoading: false,
    }));
  },
});

export const notebookActions = notebookSlice.actions;
export default notebookSlice.reducer;
