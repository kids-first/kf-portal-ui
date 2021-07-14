import { RootState } from '../rootState';

export const selectFenceConnections = (state: RootState) => state.fenceConnections.fenceConnections;
export const selectIsFetchingAllFenceConnections = (state: RootState) =>
  state.fenceConnections.isFetchingAllFenceConnections;
