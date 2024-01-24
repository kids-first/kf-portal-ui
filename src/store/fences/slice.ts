import { FENCE_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';
import { createSlice } from '@reduxjs/toolkit';

import { FENCE_NAMES } from 'common/fenceTypes';

import {
  fenceDisconnection,
  fenceOpenAuhentificationTab,
  fetchAuthorizedStudies,
  fetchFenceAuthentificationStatus,
} from './thunks';
import { InitialState } from './types';

export const FencesState: InitialState = {
  [FENCE_NAMES.gen3]: {
    id: FENCE_NAMES.gen3,
    acl: [],
    status: FENCE_AUTHENTIFICATION_STATUS.unknown,
    loading: false,
    error: false,
  },
  [FENCE_NAMES.dcf]: {
    id: FENCE_NAMES.dcf,
    acl: [],
    status: FENCE_AUTHENTIFICATION_STATUS.unknown,
    loading: false,
    error: false,
  },
  authorizedStudies: {
    studies: [],
    error: false,
    loading: false,
  },
};

const fencesSlice = createSlice({
  name: 'fences',
  initialState: FencesState,
  reducers: {},
  extraReducers: (builder) => {
    // Authentification API (open new window)
    builder.addCase(fenceOpenAuhentificationTab.pending, (state, action) => {
      state[action.meta.arg].status = FENCE_AUTHENTIFICATION_STATUS.unknown;
      state[action.meta.arg].error = false;
      state[action.meta.arg].loading = true;
    });
    builder.addCase(fenceOpenAuhentificationTab.fulfilled, (state, action) => {
      state[action.meta.arg].status = action.payload.status;
      state[action.meta.arg].acl = action.payload.acl;
      state[action.meta.arg].loading = false;
    });
    builder.addCase(fenceOpenAuhentificationTab.rejected, (state, action) => {
      state[action.meta.arg].loading = false;
      state[action.meta.arg].error = true;
    });
    // Authentification status and acl
    builder.addCase(fetchFenceAuthentificationStatus.pending, (state, action) => {
      state[action.meta.arg].status = FENCE_AUTHENTIFICATION_STATUS.unknown;
      state[action.meta.arg].error = false;
      state[action.meta.arg].loading = true;
    });
    builder.addCase(fetchFenceAuthentificationStatus.fulfilled, (state, action) => {
      state[action.meta.arg].status = action.payload.status;
      state[action.meta.arg].acl = action.payload.acl;
      state[action.meta.arg].loading = false;
    });
    builder.addCase(fetchFenceAuthentificationStatus.rejected, (state, action) => {
      state[action.meta.arg].loading = false;
      state[action.meta.arg].error = true;
    });
    // Authorized Studies
    builder.addCase(fetchAuthorizedStudies.pending, (state) => {
      state.authorizedStudies.studies = [];
      state.authorizedStudies.error = false;
      state.authorizedStudies.loading = true;
    });
    builder.addCase(fetchAuthorizedStudies.fulfilled, (state, action) => {
      state.authorizedStudies.studies = action.payload.studies;
      state.authorizedStudies.loading = false;
    });
    builder.addCase(fetchAuthorizedStudies.rejected, (state) => {
      state.authorizedStudies.loading = false;
      state.authorizedStudies.error = true;
    });
    // disconnection
    builder.addCase(fenceDisconnection.pending, (state, action) => {
      state[action.meta.arg].status = FENCE_AUTHENTIFICATION_STATUS.unknown;
      state[action.meta.arg].acl = [];
      state[action.meta.arg].loading = true;
    });
    builder.addCase(fenceDisconnection.fulfilled, (state, action) => {
      state[action.meta.arg].status = FENCE_AUTHENTIFICATION_STATUS.disconnected;
      state[action.meta.arg].loading = false;
      state.authorizedStudies.studies = [];
    });
    builder.addCase(fenceDisconnection.rejected, (state, action) => {
      state[action.meta.arg].status = FENCE_AUTHENTIFICATION_STATUS.disconnected;
      state[action.meta.arg].acl = [];
      state[action.meta.arg].loading = false;
      state[action.meta.arg].error = true;
    });
  },
});

export const fencesActions = fencesSlice.actions;
export default fencesSlice.reducer;
