import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUserSavedFilter } from 'services/api/savedFilter/models';
import { initialState } from 'store/savedFilter/types';
import {
  createSavedFilter,
  deleteSavedFilter,
  fetchSavedFilters,
  fetchSharedSavedFilter,
  setSavedFilterAsDefault,
  updateSavedFilter,
} from './thunks';

export const SavedFilterState: initialState = {
  savedFilters: [],
  sharedSavedFilter: undefined,
  isLoading: false,
  isSaving: false,
  isUpdating: false,
  selectedId: undefined,
};

const sortByUpdateDate = (sets: TUserSavedFilter[]) =>
  sets.sort((a, b) => (new Date(a.updated_date) < new Date(b.updated_date) ? 0 : -1));

const savedFilterSlice = createSlice({
  name: 'user',
  initialState: SavedFilterState,
  reducers: {
    setSelectedId: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      selectedId: action.payload,
    }),
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchSavedFilters.pending, (state) => {
      state.isLoading = true;
      state.fetchingError = undefined;
    });
    builder.addCase(fetchSavedFilters.fulfilled, (state, action) => ({
      ...state,
      savedFilters: sortByUpdateDate(action.payload),
      isLoading: false,
    }));
    builder.addCase(fetchSavedFilters.rejected, (state, action) => ({
      ...state,
      fetchingError: action.payload,
      isLoading: false,
    }));
    // Fetch Shared
    builder.addCase(fetchSharedSavedFilter.pending, (state) => {
      state.isLoading = true;
      state.fetchingError = undefined;
    });
    builder.addCase(fetchSharedSavedFilter.fulfilled, (state, action) => ({
      ...state,
      sharedSavedFilter: action.payload,
      isLoading: false,
    }));
    builder.addCase(fetchSharedSavedFilter.rejected, (state, action) => ({
      ...state,
      fetchingError: action.payload,
      isLoading: false,
    }));
    // Create
    builder.addCase(createSavedFilter.pending, (state) => {
      state.isSaving = true;
      state.error = undefined;
    });
    builder.addCase(createSavedFilter.fulfilled, (state, action) => ({
      ...state,
      savedFilters: sortByUpdateDate([...state.savedFilters, action.payload]),
      isSaving: false,
    }));
    builder.addCase(createSavedFilter.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isSaving: false,
    }));
    // Update
    builder.addCase(updateSavedFilter.pending, (state) => {
      state.isUpdating = true;
      state.error = undefined;
    });
    builder.addCase(updateSavedFilter.fulfilled, (state, action) => {
      const filters = [...state.savedFilters.filter(({ id }) => action.payload.id !== id)];

      return {
        ...state,
        savedFilters: sortByUpdateDate([...filters, action.payload]),
        isUpdating: false,
      };
    });
    builder.addCase(updateSavedFilter.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isUpdating: false,
    }));
    // Set Default
    builder.addCase(setSavedFilterAsDefault.pending, (state) => {
      state.isUpdating = true;
      state.error = undefined;
    });
    builder.addCase(setSavedFilterAsDefault.fulfilled, (state, action) => ({
      ...state,
      savedFilters: state.savedFilters.map((savedFilter) => ({
        ...savedFilter,
        favorite: savedFilter.id === action.payload.id ? true : false,
      })),
      isUpdating: false,
    }));
    builder.addCase(setSavedFilterAsDefault.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isUpdating: false,
    }));
    // Delete
    builder.addCase(deleteSavedFilter.fulfilled, (state, action) => ({
      ...state,
      savedFilters: state.savedFilters.filter(({ id }) => id !== action.payload),
    }));
    builder.addCase(deleteSavedFilter.rejected, (state, action) => ({
      ...state,
      error: action.payload,
    }));
  },
});

export const savedFilterActions = savedFilterSlice.actions;
export default savedFilterSlice.reducer;
