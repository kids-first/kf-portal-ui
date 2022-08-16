import { FENCE_NAMES } from 'common/fenceTypes';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fenceConnectionSelector } from './selector';
import { checkFenceAuthStatus, checkFencesAuthStatus } from './thunks';

export type { initialState as FenceConnectionInitialState } from './types';
export { default, FenceConnectionState } from './slice';

export const useFenceConnection = (fence?: FENCE_NAMES) => {
  const dispatch = useDispatch();
  const state = useSelector(fenceConnectionSelector);

  useEffect(() => {
    if (fence) {
      dispatch(checkFenceAuthStatus(fence));
    } else {
      dispatch(checkFencesAuthStatus());
    }
    // eslint-disable-next-line
  }, []);

  return {
    ...state,
    fencesAllAcls: Object.values(state.fencesAcls).flat(),
  };
};
