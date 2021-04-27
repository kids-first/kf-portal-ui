import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './rootState';

export enum ClusterApiStatus {
  stopped = 'STOPPED',
  createInProgress = 'CREATE_IN_PROGRESS',
  createComplete = 'CREATE_COMPLETE',
  deleteInProgress = 'DELETE_IN_PROGRESS',
  rollback = 'ROLLBACK_COMPLETE',
}

export enum ClusterUnverifiedStatus {
  unverified = 'UNVERIFIED',
}
export class UnAuthorizedClusterError extends Error {}

export const NO_OPEN_CONNECTION_DATA_INTEGRATION = 'no.open.connection';

export type ClusterStatus = ClusterApiStatus | ClusterUnverifiedStatus;

export const isClusterStatusIdling = (status: ClusterStatus) =>
  status === ClusterApiStatus.createComplete ||
  status === ClusterApiStatus.stopped ||
  status === ClusterApiStatus.rollback;

export const isClusterStatusInProgress = (status: ClusterStatus) =>
  status === ClusterApiStatus.deleteInProgress || status === ClusterApiStatus.createInProgress;

export const isClusterRunning = (status: ClusterStatus) =>
  status === ClusterApiStatus.createComplete;

export enum WorkBenchActions {
  startCluster = 'StartClusterAction',
  addClusterStatus = 'AddClusterStatusAction',
  deleteCluster = 'DeleteClusterAction',
  failure = 'FailureAction',
  toggleLoading = 'ToggleLoadingAction',
  reInitialize = 'ReInitializeAction',
  addClusterUrl = 'AddClusterUrlAction',
  clearClusterError = 'ClearClusterError',
}

type ReInitializeStateAction = {
  type: WorkBenchActions.reInitialize;
};

type AddStatusAction = {
  type: WorkBenchActions.addClusterStatus;
  status: ClusterStatus;
};

type DeleteClusterAction = {
  type: WorkBenchActions.deleteCluster;
};

type StartClusterAction = {
  type: WorkBenchActions.startCluster;
};

type FailureAction = {
  type: WorkBenchActions.failure;
  error: Error | null;
};

type ToggleLoadingAction = {
  type: WorkBenchActions.toggleLoading;
  isLoading: boolean;
};

type AddClusterUrl = {
  type: WorkBenchActions.addClusterUrl;
  url: string;
};

type ClearClusterError = {
  type: WorkBenchActions.clearClusterError;
};

export type WorkBenchState = {
  isLoading: boolean;
  error: Error | UnAuthorizedClusterError | null | undefined;
  status: ClusterStatus;
  url: string | null | undefined;
};

export type WorkBenchActionTypes =
  | AddStatusAction
  | FailureAction
  | ToggleLoadingAction
  | StartClusterAction
  | DeleteClusterAction
  | AddClusterUrl
  | ReInitializeStateAction
  | ClearClusterError;

export type DispatchWorkBench = ThunkDispatch<RootState, null, WorkBenchActionTypes>;
