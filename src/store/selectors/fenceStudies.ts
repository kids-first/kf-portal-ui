import { RootState } from '../rootState';

export const selectFenceStudies = (state: RootState) => state.fenceStudies.fenceStudies;
export const selectIsFetchingAllFenceStudies = (state: RootState) =>
  state.fenceStudies.isFetchingAllFenceStudies;
