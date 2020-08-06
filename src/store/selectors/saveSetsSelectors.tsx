import { RootState } from '../rootState';

export const selectTagNameConflict = (state: RootState) => state.saveSets.create.tagNameConflict;
export const selectIsLoading = (state: RootState) => state.saveSets.create.isLoading;
export const selectError = (state: RootState) => state.saveSets.create.error;
