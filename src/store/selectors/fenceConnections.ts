import { FenceName } from '../fenceTypes';
import { RootState } from '../rootState';

export const selectFenceConnections = (state: RootState) => state.fenceConnections.fenceConnections;
export const selectLoadingFences = (state: RootState) => state.fenceConnections.loadingFences;
export const selectFenceStatus = (fenceName: FenceName, state: RootState) =>
  state.fenceConnections.statuses[fenceName];
export const selectFenceStatuses = (state: RootState) => state.fenceConnections.statuses;
export const selectFenceConnection = (fenceName: FenceName, state: RootState) =>
  state.fenceConnections.fenceConnections[fenceName];
export const selectFencesConnectError = (state: RootState) =>
  state.fenceConnections.fencesConnectError;
export const selectFencesDisconnectError = (state: RootState) =>
  state.fenceConnections.fencesDisConnectError;
