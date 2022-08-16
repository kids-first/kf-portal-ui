import { createSlice } from '@reduxjs/toolkit';
import { FENCE_NAMES } from 'common/fenceTypes';
import { initialState } from 'store/fenceStudies/types';
import { fetchFenceStudies } from './thunks';

export const FenceStudiesState: initialState = {
  studies: {},
  loadingStudiesForFences: [],
  fencesError: [],
};

const removeFenceAuthError = (state: FENCE_NAMES[], fenceName: FENCE_NAMES) =>
  state.filter((name) => name !== fenceName);

const removeLoadingFenceStudies = (state: initialState, fenceName: FENCE_NAMES) =>
  state.loadingStudiesForFences.filter((name) => name !== fenceName);

const addLoadingFenceStudies = (state: initialState, fenceName: FENCE_NAMES) =>
  state.loadingStudiesForFences.includes(fenceName)
    ? state.loadingStudiesForFences
    : [...state.loadingStudiesForFences, fenceName];

const fenceStudiesSlice = createSlice({
  name: 'fenceStudies',
  initialState: FenceStudiesState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH FENCE STUDIES
    builder.addCase(fetchFenceStudies.pending, (state, action) => {
      state.fencesError = removeFenceAuthError(state.fencesError, action.meta.arg.fenceName);
      state.loadingStudiesForFences = addLoadingFenceStudies(state, action.meta.arg.fenceName);
    });
    builder.addCase(fetchFenceStudies.fulfilled, (state, action) => {
      state.loadingStudiesForFences = removeLoadingFenceStudies(state, action.meta.arg.fenceName);
      state.studies = {
        ...state.studies,
        ...action.payload,
      };
    });
    builder.addCase(fetchFenceStudies.rejected, (state, action) => {
      state.loadingStudiesForFences = removeLoadingFenceStudies(state, action.meta.arg.fenceName);
      state.fencesError = [...state.fencesError, action.meta.arg.fenceName];
    });
  },
});

export const fenceStudiesActions = fenceStudiesSlice.actions;
export default fenceStudiesSlice.reducer;
