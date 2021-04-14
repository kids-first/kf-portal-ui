import { RootState } from '../rootState';

export const selectIsLoading = (state: RootState) => state.workBench.isLoading;
export const selectStatus = (state: RootState) => state.workBench.status;
export const selectError = (state: RootState) => state.workBench.error;
export const selectClusterUrl = (state: RootState) => state.workBench.url;
