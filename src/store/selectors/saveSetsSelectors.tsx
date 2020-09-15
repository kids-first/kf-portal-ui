import { RootState } from '../rootState';

export const selectIsLoading = (state: RootState) => state.saveSets.create.isLoading;
export const selectError = (state: RootState) => state.saveSets.create.error;
export const selectIsLoadingSets = (state: RootState) => state.saveSets.userSets.isLoading;
export const selectUserSets = (state: RootState) => state.saveSets.userSets.sets;
export const selectErrorUserSets = (state: RootState) => state.saveSets.userSets.error;
export const selectIsDeletingSets = (state: RootState) => state.saveSets.userSets.isDeleting;
export const selectIsEditingSets = (state: RootState) => state.saveSets.userSets.isEditing;
