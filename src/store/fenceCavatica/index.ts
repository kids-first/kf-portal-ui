import { FENCE_CONNECTION_STATUSES, FENCE_NAMES } from 'common/fenceTypes';
import { useSelector } from 'react-redux';
import { useFenceConnection } from 'store/fenceConnection';
import { fenceCavaticaSelector } from './selector';

export type { initialState as FenceCavaticaInitialState } from './types';
export { default, FenceCavaticaState } from './slice';
export const useFenceCavatica = () => {
  const state = useSelector(fenceCavaticaSelector);
  const { connectionStatus, loadingFences, fencesConnectError } = useFenceConnection(
    FENCE_NAMES.cavatica,
  );
  const isConnected = (status: FENCE_CONNECTION_STATUSES) =>
    status === FENCE_CONNECTION_STATUSES.connected;

  return {
    ...state,
    isConnected: isConnected(connectionStatus.cavatica),
    connectionLoading: loadingFences.includes(FENCE_NAMES.cavatica),
    hasErrors: fencesConnectError.includes(FENCE_NAMES.cavatica),
  };
};
