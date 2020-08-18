import { RootState } from '../rootState';

export const selectIsLoading = (state: RootState) => state.saveSets.create.isLoading;
export const selectError = (state: RootState) => state.saveSets.create.error;
export const selectDefaultTag = (state: RootState) => state.saveSets.create.defaultTag;
export const selectIsLoadingSaveSets = (state: RootState) => state.saveSets.userSets.isLoading;
export const selectUserSaveSets = (state: RootState) => state.saveSets.userSets.sets;
export const selectErrorUserSaveSets = (state: RootState) => state.saveSets.userSets.error;
