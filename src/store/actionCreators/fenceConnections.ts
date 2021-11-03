import { notification } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { ThunkAction } from 'redux-thunk';

import { deleteFenceTokens, fenceConnect, fetchFenceConnection } from 'services/fence';

import { Api } from '../apiTypes';
import { ConnectionStatus } from '../connectionTypes';
import {
  Connection,
  FenceConnections,
  FenceConnectionsActions,
  FenceConnectionsActionTypes,
} from '../fenceConnectionsTypes';
import { AllFencesNames, FenceName } from '../fenceTypes';
import { RootState } from '../rootState';
import { selectFenceConnection, selectFenceStatus } from '../selectors/fenceConnections';

const { entries, keys } = Object;

const NOTIFICATION_DURATION_IN_SEC = 10;

export const addFenceConnectError = (fenceName: FenceName): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.addFenceConnectError,
  fenceName,
});

export const removeFenceConnectError = (fenceName: FenceName): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.removeFenceConnectError,
  fenceName,
});

export const addFenceDisconnectError = (fenceName: FenceName): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.addFenceDisconnectError,
  fenceName,
});

export const removeFenceDisconnectError = (fenceName: FenceName): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.removeFenceDisconnectError,
  fenceName,
});

export const toggleIsFetchingOneFenceConnection = (
  isLoading: boolean,
  fenceName: FenceName,
): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.toggleIsFetchingOneFenceConnection,
  isLoading,
  fenceName,
});

export const toggleIsFetchingAllFenceConnections = (
  isLoading: boolean,
): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.toggleIsFetchingAllFenceConnections,
  isLoading,
});

export const addFenceConnection = (
  fenceName: FenceName,
  connection: Connection,
): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.addFenceConnection,
  fenceName,
  connection,
});

export const addFenceStatus = (
  fenceName: FenceName,
  newStatus: ConnectionStatus,
): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.addConnectionStatus,
  fenceName,
  newStatus,
});

const shouldFetchConnections = (fenceName: FenceName, state: RootState): boolean =>
  isEmpty(selectFenceConnection(fenceName, state)) &&
  [ConnectionStatus.unknown, ConnectionStatus.connected].includes(
    selectFenceStatus(fenceName, state),
  );

export const fetchFencesConnections = (
  api: Api,
  fenceName: FenceName,
): ThunkAction<void, RootState, null, FenceConnectionsActionTypes> => async (dispatch) => {
  try {
    const connection = await fetchFenceConnection(api, fenceName);
    dispatch(addFenceConnection(fenceName, connection));
    dispatch(addFenceStatus(fenceName, ConnectionStatus.connected));
  } catch (error) {
    dispatch(addFenceStatus(fenceName, ConnectionStatus.disconnected));
    console.error(`Error fetching fence connection for '${fenceName}': ${error}`);
  }
};

export const removeFenceConnection = (fenceName: FenceName): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.removeFenceConnection,
  fenceName,
});

export const removeAllFencesConnections = (): ThunkAction<
  void,
  RootState,
  null,
  FenceConnectionsActionTypes
> => async (dispatch) => {
  for (const fenceName of AllFencesNames) {
    await dispatch(removeFenceConnection(fenceName));
  }
};

export const fetchFencesConnectionsIfNeeded = (
  api: Api,
  fenceName: FenceName,
): ThunkAction<void, RootState, null, FenceConnectionsActionTypes> => async (
  dispatch,
  getState,
) => {
  if (shouldFetchConnections(fenceName, getState())) {
    return dispatch(fetchFencesConnections(api, fenceName));
  }
};

export const fetchAllFencesConnectionsIfNeeded = (
  api: Api,
  fencesName: FenceName[],
): ThunkAction<void, RootState, null, FenceConnectionsActionTypes> => async (dispatch) => {
  dispatch(toggleIsFetchingAllFenceConnections(true));
  for (const fenceName of fencesName) {
    await dispatch(fetchFencesConnectionsIfNeeded(api, fenceName));
  }
  dispatch(toggleIsFetchingAllFenceConnections(false));
};

export const connectFence = (
  api: Api,
  fenceName: FenceName,
): ThunkAction<void, RootState, null, FenceConnectionsActionTypes> => async (dispatch) => {
  dispatch(toggleIsFetchingOneFenceConnection(true, fenceName));
  try {
    await fenceConnect(api, fenceName);
    const connection = await fetchFenceConnection(api, fenceName);
    dispatch(addFenceConnection(fenceName, connection));
    dispatch(addFenceStatus(fenceName, ConnectionStatus.connected));
    notification.success({
      message: 'Success',
      description: ' Controlled dataset access successfully connected.',
      duration: NOTIFICATION_DURATION_IN_SEC,
    });
  } catch (error) {
    dispatch(addFenceConnectError(fenceName));
    dispatch(removeFenceConnection(fenceName));
    dispatch(addFenceStatus(fenceName, ConnectionStatus.disconnected));
  } finally {
    dispatch(toggleIsFetchingOneFenceConnection(false, fenceName));
  }
};

export const disconnectFence = (
  api: Api,
  fenceName: FenceName,
): ThunkAction<void, RootState, null, FenceConnectionsActionTypes> => async (dispatch) => {
  dispatch(toggleIsFetchingOneFenceConnection(true, fenceName));
  try {
    await deleteFenceTokens(api, fenceName);
  } catch (error) {
    dispatch(addFenceDisconnectError(fenceName));
  } finally {
    dispatch(removeFenceConnection(fenceName));
    dispatch(addFenceStatus(fenceName, ConnectionStatus.disconnected));
    dispatch(toggleIsFetchingOneFenceConnection(false, fenceName));
  }
};

export const concatAllFencesAcls = (fenceConnections: FenceConnections) => {
  const fenceNames = keys(fenceConnections) as FenceName[];
  return fenceNames.map((fence: FenceName) => keys(fenceConnections[fence]?.projects || [])).flat();
};

export const computeAclsForConnection = (connection: Connection) => keys(connection.projects || {});

export const computeAclsByFence = (fenceConnections: FenceConnections) =>
  entries(fenceConnections).reduce(
    (acc, [fenceName, connection]) =>
      connection
        ? {
            ...acc,
            [fenceName]: computeAclsForConnection(connection),
          }
        : acc,
    {},
  );
