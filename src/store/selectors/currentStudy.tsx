import { RootState } from '../rootState';

export const selectICurrentVSLoading = (state: RootState) => state.currentVirtualStudy.isLoading;
export const selectCurrentVSError = (state: RootState) => state.currentVirtualStudy.error;
export const selectCurrentSqons = (state: RootState) => state.currentVirtualStudy.sqons;
export const selectCurrentSelectionSqons = (state: RootState) =>
  state.currentVirtualStudy.selectionSqon;
