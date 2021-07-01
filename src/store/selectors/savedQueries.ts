import { RootState } from '../rootState';

export const selectSavedQueries = (state: RootState) => state.savedQueries.queries;
export const selectSavedQueryIdToStatus = (state: RootState) => state.savedQueries.queryIdToStatus;
export const selectIsLoadingAllSavedQueries = (state: RootState) =>
  state.savedQueries.isLoadingAllQueries;
export const selectErrorFetchAllSavedQueries = (state: RootState) =>
  state.savedQueries.errorFetchAllQueries;
