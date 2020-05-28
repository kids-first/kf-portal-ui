import { RootState } from '../rootState';

export const selectIsReportLoading = (state: RootState) => state.report.isLoading;
export const selectReportMessage = (state: RootState) => state.report.message;
export const selectReportError = (state: RootState) => state.report.error;
