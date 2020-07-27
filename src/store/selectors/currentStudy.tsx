import { RootState } from '../rootState';

export const selectICurrentVSLoading = (state: RootState) => state.currentVirtualStudy.isLoading;
export const selectCurrentVSError = (state: RootState) => state.currentVirtualStudy.error;
