import { RootState } from '../rootState';
import { EntityName } from '../fileSearchFiltersTypes';

export const selectIsFileSearchFilterLoading = (state: RootState, entityName: EntityName) =>
  state.fileSearchFilters[entityName].isLoading;
export const selectFileSearchFilterError = (state: RootState, entityName: EntityName) =>
  state.fileSearchFilters[entityName].error;
