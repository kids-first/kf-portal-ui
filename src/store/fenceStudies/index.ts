import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { FENCE_CONNECTION_STATUSES, FENCE_NAMES } from 'common/fenceTypes';
import { useFenceConnection } from 'store/fenceConnection';

import { fenceStudiesSelector } from './selector';
import { computeAllFencesAuthStudies } from './thunks';

export type { initialState as fenceStudiesInitialState } from './types';
export { default, FenceStudiesState } from './slice';

export const useFenceStudies = (fence: FENCE_NAMES) => {
  const state = useSelector(fenceStudiesSelector);

  const { connectionStatus, fencesConnectError, loadingFences } = useFenceConnection(fence);
  const isConnected = (status: FENCE_CONNECTION_STATUSES) =>
    status === FENCE_CONNECTION_STATUSES.connected;

  return {
    ...state,
    fenceStudiesAcls: computeAllFencesAuthStudies(state.studies),
    isConnected: isConnected(connectionStatus[fence]),
    connectionLoading: loadingFences.includes(fence),
    hasErrors: fencesConnectError.includes(fence) || !isEmpty(state.fencesError),
  };
};
