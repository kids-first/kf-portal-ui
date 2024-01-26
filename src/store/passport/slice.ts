import { CAVATICA_API_ERROR_TYPE } from '@ferlab/ui/core/components/Widgets/Cavatica';
import {
  CAVATICA_ANALYSE_STATUS,
  PASSPORT_AUTHENTIFICATION_STATUS,
} from '@ferlab/ui/core/components/Widgets/Cavatica/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  beginCavaticaAnalyse,
  createCavaticaProjet,
  disconnectCavaticaPassport,
  fetchCavaticaAuthentificationStatus,
  fetchCavaticaBillingGroups,
  fetchCavaticaProjects,
} from './thunks';
import { InitialState } from './type';

export const passportState: InitialState = {
  cavatica: {
    authentification: {
      status: PASSPORT_AUTHENTIFICATION_STATUS.unknown,
      error: false,
      loading: false,
    },
    projects: {
      data: [],
      loading: false,
      error: false,
    },
    billingGroups: {
      data: [],
      loading: false,
      error: false,
    },
    bulkImportData: {
      loading: false,
      status: CAVATICA_ANALYSE_STATUS.unknow,
      files: [],
      authorizedFiles: [],
    },
  },
};

const passportSlice = createSlice({
  name: 'passport',
  initialState: passportState,
  reducers: {
    resetCavaticaProjectsError: (state) => {
      state.cavatica.projects.error = false;
    },
    resetCavaticaBillingsGroupError: (state) => {
      state.cavatica.billingGroups.error = false;
    },
    setCavaticaBulkImportDataStatus: (state, action: PayloadAction<CAVATICA_ANALYSE_STATUS>) => {
      state.cavatica.bulkImportData.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Cavatica
    // AUTHENTIFICATION
    builder.addCase(fetchCavaticaAuthentificationStatus.pending, (state, action) => {
      state.cavatica.projects.error = false;
      state.cavatica.billingGroups.error = false;
      state.cavatica.bulkImportData.status = CAVATICA_ANALYSE_STATUS.unknow;
      state.cavatica.authentification.loading = true;
      state.cavatica.authentification.status = PASSPORT_AUTHENTIFICATION_STATUS.unknown;
    });
    builder.addCase(fetchCavaticaAuthentificationStatus.fulfilled, (state, action) => {
      state.cavatica.authentification.loading = false;
      state.cavatica.authentification.status = action.payload.status;
    });
    builder.addCase(fetchCavaticaAuthentificationStatus.rejected, (state, action) => {
      state.cavatica.authentification.loading = false;
      state.cavatica.authentification.error = true;
    });
    // DISCONNECTION
    builder.addCase(disconnectCavaticaPassport.pending, (state, action) => {
      state.cavatica.authentification.loading = true;
      state.cavatica.authentification.status = PASSPORT_AUTHENTIFICATION_STATUS.unknown;
    });
    builder.addCase(disconnectCavaticaPassport.fulfilled, (state, action) => {
      state.cavatica.authentification.loading = false;
      state.cavatica.authentification.status = PASSPORT_AUTHENTIFICATION_STATUS.disconnected;
    });
    builder.addCase(disconnectCavaticaPassport.rejected, (state, action) => {
      state.cavatica.authentification.loading = false;
      state.cavatica.authentification.error = true;
    });
    // FETCH PROJECT
    builder.addCase(fetchCavaticaProjects.pending, (state, action) => {
      state.cavatica.projects.loading = true;
    });
    builder.addCase(fetchCavaticaProjects.fulfilled, (state, action) => {
      state.cavatica.projects.loading = false;
      state.cavatica.projects.data = action.payload;
    });
    builder.addCase(fetchCavaticaProjects.rejected, (state, action) => {
      state.cavatica.projects.loading = false;
      state.cavatica.projects.error = CAVATICA_API_ERROR_TYPE.fetch;
    });
    // BILLINGS GROUPS
    builder.addCase(fetchCavaticaBillingGroups.pending, (state, action) => {
      state.cavatica.billingGroups.loading = true;
    });
    builder.addCase(fetchCavaticaBillingGroups.fulfilled, (state, action) => {
      state.cavatica.billingGroups.loading = false;
      state.cavatica.billingGroups.data = action.payload;
    });
    builder.addCase(fetchCavaticaBillingGroups.rejected, (state, action) => {
      state.cavatica.billingGroups.loading = false;
      state.cavatica.billingGroups.error = action.payload;
    });
    // CREATE PROJECT
    builder.addCase(createCavaticaProjet.pending, (state, action) => {
      state.cavatica.projects.loading = true;
    });
    builder.addCase(createCavaticaProjet.fulfilled, (state, action) => {
      state.cavatica.projects.loading = false;
      state.cavatica.projects.data.push(action.payload.newProject);
    });
    builder.addCase(createCavaticaProjet.rejected, (state, action) => {
      state.cavatica.projects.loading = false;
      state.cavatica.projects.error = CAVATICA_API_ERROR_TYPE.create;
    });
    // ANALYSE PROJECT
    builder.addCase(beginCavaticaAnalyse.pending, (state, action) => {
      state.cavatica.bulkImportData.loading = true;
      state.cavatica.bulkImportData.status = CAVATICA_ANALYSE_STATUS.unknow;
    });
    builder.addCase(beginCavaticaAnalyse.fulfilled, (state, action) => {
      state.cavatica.bulkImportData.loading = false;
      state.cavatica.bulkImportData.status = CAVATICA_ANALYSE_STATUS.analyzed;
      state.cavatica.bulkImportData.files = action.payload.files;
      state.cavatica.bulkImportData.authorizedFiles = action.payload.authorizedFiles;
    });
    builder.addCase(beginCavaticaAnalyse.rejected, (state, action) => {
      state.cavatica.bulkImportData.loading = false;
      if (action.payload) {
        state.cavatica.bulkImportData.status = action.payload as CAVATICA_ANALYSE_STATUS;
      } else {
        state.cavatica.bulkImportData.status = CAVATICA_ANALYSE_STATUS.generic_error;
      }
    });
  },
});

export const passportActions = passportSlice.actions;
export default passportSlice.reducer;
