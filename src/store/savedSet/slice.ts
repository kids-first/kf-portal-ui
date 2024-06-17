import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/savedSet/types';
import { sortByUpdateDate } from 'utils/dates';
import {
  createSavedSet,
  deleteSavedSet,
  fetchSavedSet,
  fetchSharedBiospecimenRequest,
  updateSavedSet,
} from './thunks';

export const SavedSetState: initialState = {
  savedSets: [],
  sharedBiospecimenRequest: undefined,
  isLoading: true,
  isUpdating: false,
  selectedId: undefined,
};

const savedSetSlice = createSlice({
  name: 'user',
  initialState: SavedSetState,
  reducers: {
    setSelectedId: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      selectedId: action.payload,
    }),
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchSavedSet.pending, (state) => {
      state.isLoading = true;
      state.fetchingError = undefined;
    });
    builder.addCase(fetchSavedSet.fulfilled, (state, action) => ({
      ...state,
      savedSets: sortByUpdateDate(action.payload),
      isLoading: false,
    }));
    builder.addCase(fetchSavedSet.rejected, (state, action) => ({
      ...state,
      fetchingError: action.payload,
      isLoading: false,
    }));
    // Fetch Shared
    builder.addCase(fetchSharedBiospecimenRequest.pending, (state) => {
      state.isLoading = true;
      state.fetchingError = undefined;
    });
    builder.addCase(fetchSharedBiospecimenRequest.fulfilled, (state, action) => ({
      ...state,
      sharedBiospecimenRequest: action.payload,
      isLoading: false,
    }));
    builder.addCase(fetchSharedBiospecimenRequest.rejected, (state, action) => ({
      ...state,
      fetchingError: action.payload,
      isLoading: false,
    }));
    // Create
    builder.addCase(createSavedSet.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(createSavedSet.fulfilled, (state, action) => ({
      ...state,
      savedSets: sortByUpdateDate([...state.savedSets, action.payload]),
      isLoading: false,
    }));
    builder.addCase(createSavedSet.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isLoading: false,
    }));
    // Update
    builder.addCase(updateSavedSet.pending, (state) => {
      state.isUpdating = true;
      state.error = undefined;
    });
    builder.addCase(updateSavedSet.fulfilled, (state, action) => {
      const sets = [...state.savedSets.filter(({ id }) => action.payload.id !== id)];

      return {
        ...state,
        savedSets: sortByUpdateDate([...sets, action.payload]),
        isUpdating: false,
      };
    });
    builder.addCase(updateSavedSet.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isUpdating: false,
    }));
    // Delete
    builder.addCase(deleteSavedSet.fulfilled, (state, action) => ({
      ...state,
      savedSets: state.savedSets.filter(({ id }) => id !== action.payload),
    }));
    builder.addCase(deleteSavedSet.rejected, (state, action) => ({
      ...state,
      error: action.payload,
    }));
  },
});

export const savedSetActions = savedSetSlice.actions;
export default savedSetSlice.reducer;
