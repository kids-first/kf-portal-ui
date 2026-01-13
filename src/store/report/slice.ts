import { createSlice } from '@reduxjs/toolkit';

import { fetchReport, fetchTsvReport } from 'store/report/thunks';
import { initialState } from 'store/report/types';

export const ReportState: initialState = {
  isLoading: false,
};

const reportSlice = createSlice({
  name: 'report',
  initialState: ReportState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReport.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchReport.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchReport.fulfilled, (state) => {
      state.isLoading = false;
    });
    // FETCH TSV
    builder.addCase(fetchTsvReport.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTsvReport.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(fetchTsvReport.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});

export const reportActions = reportSlice.actions;
export default reportSlice.reducer;
