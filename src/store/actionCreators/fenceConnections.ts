import isEmpty from 'lodash/isEmpty';
import { ThunkAction } from 'redux-thunk';

import { hasIntegrationTokenForFence } from 'components/Login/utils';
import { getFenceUser } from 'services/fence';

import { Api } from '../apiTypes';
import {
  Connection,
  FenceConnections,
  FenceConnectionsActions,
  FenceConnectionsActionTypes,
} from '../fenceConnectionsTypes';
import { FenceName } from '../fenceTypes';
import { RootState } from '../rootState';
import { selectFenceConnections } from '../selectors/fenceConnections';

const { entries, keys } = Object;

export const addFenceConnection = (
  fenceName: FenceName,
  connection: Connection,
): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.addFenceConnection,
  fenceName,
  connection,
});

const toggleIsFetchingAllFenceConnections = (isLoading: boolean): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.toggleIsFetchingAllFenceConnections,
  isLoading,
});

const shouldFetchConnections = (fenceName: FenceName, state: RootState): boolean =>
  hasIntegrationTokenForFence(fenceName) && isEmpty(selectFenceConnections(state)[fenceName]);

const fetchFencesConnections = (
  api: Api,
  fenceName: FenceName,
): ThunkAction<void, RootState, null, FenceConnectionsActionTypes> => async (dispatch) => {
  try {
    const connection = await getFenceUser(api, fenceName);
    dispatch(addFenceConnection(fenceName, connection));
  } catch (error) {
    console.error(`Error fetching fence connection for '${fenceName}': ${error}`);
  }
};

export const removeFenceConnection = (fenceName: FenceName): FenceConnectionsActionTypes => ({
  type: FenceConnectionsActions.removeFenceConnection,
  fenceName,
});

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

export const concatAllFencesAcls = (fenceConnections: FenceConnections) => {
  const fenceNames = keys(fenceConnections);
  return fenceNames.map((fence: FenceName) => keys(fenceConnections[fence].projects)).flat();
};

export const computeAclsForConnection = (connection: Connection) => keys(connection.projects || {});

export const computeAclsByFence = (fenceConnections: FenceConnections) =>
  entries(fenceConnections).reduce(
    (acc, [fenceName, connection]) => ({
      ...acc,
      [fenceName]: computeAclsForConnection(connection),
    }),
    {},
  );
