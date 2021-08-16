import { FenceName } from '../fenceTypes';
import { RootState } from '../rootState';

export const selectFenceStudies = (state: RootState) => state.fenceStudies.fenceStudies;
export const selectLoadingStudiesForFences = (state: RootState) =>
  state.fenceStudies.loadingStudiesForFences || [];
export const selectFenceStudiesStatus = (fenceName: FenceName, state: RootState) =>
  state.fenceStudies.statuses[fenceName];
