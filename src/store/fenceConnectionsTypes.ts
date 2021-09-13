import { ThunkDispatch } from 'redux-thunk';

import { ConnectionStatus } from './connectionTypes';
import { FenceName } from './fenceTypes';
import { RootState } from './rootState';
import { Nullable } from './utilityTypes';

export type Projects = { [index: string]: any };

export type Connection = {
  authz: { [index: string]: any };
  azp: Nullable<string>;
  certificates_uploaded: any[];
  display_name: Nullable<string>;
  email: Nullable<string>;
  groups: string[];
  is_admin: boolean;
  message: string;
  name: string;
  phone_number: Nullable<string>;
  preferred_username: Nullable<string>;
  primary_google_service_account: Nullable<string>;
  project_access: { [index: string]: any };
  projects: Projects;
  resources: any[];
  resources_granted: any[];
  role: string;
  sub: number;
  user_id: number;
  username: string;
};

export type FenceConnections = { [FenceName.gen3]?: Connection; [FenceName.dcf]?: Connection };

export enum FenceConnectionsActions {
  requestFetchFenceConnections = 'requestFetchFenceConnections',
  fetchFenceConnections = 'fetchFenceConnections',
  failureFetchingFenceConnections = 'failureFetchingFenceConnections',
  toggleIsFetchingAllFenceConnections = 'toggleIsFetchingAllFenceConnections',
  addFenceConnection = 'addFenceConnection',
  requestFetchFenceStudies = 'requestFetchFenceStudies',
  fetchFenceStudies = 'fetchFenceStudies',
  failureFetchingFenceStudies = 'failureFetchingFenceStudies',
  removeFenceConnection = 'removeFenceConnection',
  removeAllFencesConnection = 'removeAllFencesConnection',
  addConnectionStatus = 'addFenceConnectionStatus',
  removeConnectionStatus = 'removeConnectionStatus',
  toggleIsFetchingOneFenceConnection = 'toggleIsFetchingOneFenceConnection',
  addFenceConnectError = 'addFenceConnectError',
  removeFenceConnectError = 'removeFenceConnectError',
  addFenceDisconnectError = 'addFenceDisconnectError',
  removeFenceDisconnectError = 'removeFenceDisconnectError',
}

export type AddFenceConnectError = {
  type: FenceConnectionsActions.addFenceConnectError;
  fenceName: FenceName;
};

export type RemoveFenceConnectError = {
  type: FenceConnectionsActions.removeFenceConnectError;
  fenceName: FenceName;
};

export type AddFenceDisconnectError = {
  type: FenceConnectionsActions.addFenceDisconnectError;
  fenceName: FenceName;
};

export type RemoveFenceDisconnectError = {
  type: FenceConnectionsActions.removeFenceDisconnectError;
  fenceName: FenceName;
};

export type ToggleIsFetchingOneFenceConnectionsAction = {
  type: FenceConnectionsActions.toggleIsFetchingOneFenceConnection;
  isLoading: boolean;
  fenceName: FenceName;
};

export type AddConnectionStatusAction = {
  type: FenceConnectionsActions.addConnectionStatus;
  fenceName: FenceName;
  newStatus: ConnectionStatus;
};

export type RequestFetchFenceStudiesAction = {
  type: FenceConnectionsActions.requestFetchFenceStudies;
};

export type FetchFenceStudiesAction = {
  type: FenceConnectionsActions.fetchFenceStudies;
};

export type FailureFetchingFenceStudiesAction = {
  type: FenceConnectionsActions.failureFetchingFenceStudies;
};

export type ToggleIsFetchingAllFenceConnectionsAction = {
  type: FenceConnectionsActions.toggleIsFetchingAllFenceConnections;
  isLoading: boolean;
};

export type AddFenceConnectionsAction = {
  type: FenceConnectionsActions.addFenceConnection;
  fenceName: FenceName;
  connection: Connection;
};

export type RequestFetchFenceConnectionsAction = {
  type: FenceConnectionsActions.requestFetchFenceConnections;
};

export type FetchFenceConnectionsAction = {
  type: FenceConnectionsActions.fetchFenceConnections;
};

export type RemoveFenceConnection = {
  type: FenceConnectionsActions.removeFenceConnection;
  fenceName: FenceName;
};

export type RemoveAllFencesConnection = {
  type: FenceConnectionsActions.removeAllFencesConnection;
};

export type FenceConnectionsState = {
  fenceConnections: FenceConnections;
  statuses: { [FenceName.gen3]: ConnectionStatus; [FenceName.dcf]: ConnectionStatus };
  loadingFences: FenceName[];
  fencesConnectError: FenceName[];
  fencesDisConnectError: FenceName[];
};

export const fenceConnectionsInitialState: FenceConnectionsState = {
  fenceConnections: {},
  statuses: {
    [FenceName.gen3]: ConnectionStatus.unknown,
    [FenceName.dcf]: ConnectionStatus.unknown,
  },
  loadingFences: [],
  fencesConnectError: [],
  fencesDisConnectError: [],
};

export type FenceConnectionsActionTypes =
  | RequestFetchFenceConnectionsAction
  | FetchFenceConnectionsAction
  | AddFenceConnectionsAction
  | ToggleIsFetchingAllFenceConnectionsAction
  | RequestFetchFenceStudiesAction
  | FetchFenceStudiesAction
  | FailureFetchingFenceStudiesAction
  | RemoveFenceConnection
  | RemoveAllFencesConnection
  | AddConnectionStatusAction
  | ToggleIsFetchingOneFenceConnectionsAction
  | AddFenceConnectError
  | RemoveFenceConnectError
  | AddFenceDisconnectError
  | RemoveFenceDisconnectError;

export type DispatchFenceConnections = ThunkDispatch<RootState, null, FenceConnectionsActionTypes>;
