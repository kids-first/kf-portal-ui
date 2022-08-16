import { FENCE_CONNECTION_STATUSES, FENCE_NAMES } from 'common/fenceTypes';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { useFenceConnection } from 'store/fenceConnection';
import { fenceStudiesSelector } from './selector';
import { computeAllFencesAuthStudies } from './thunks';

export type { initialState as fenceStudiesInitialState } from './types';
export { default, FenceStudiesState } from './slice';

export const useFenceStudies = () => {
  const state = useSelector(fenceStudiesSelector);
  const { connectionStatus, fencesConnectError, loadingFences } = useFenceConnection(
    FENCE_NAMES.gen3,
  );
  const isConnected = (status: FENCE_CONNECTION_STATUSES) =>
    status === FENCE_CONNECTION_STATUSES.connected;

  return {
    ...state,
    fenceStudiesAcls: computeAllFencesAuthStudies(state.studies),
    isConnected: isConnected(connectionStatus.gen3),
    connectionLoading: loadingFences.includes(FENCE_NAMES.gen3),
    hasErrors: fencesConnectError.includes(FENCE_NAMES.gen3) || !isEmpty(state.fencesError),
  };
};
