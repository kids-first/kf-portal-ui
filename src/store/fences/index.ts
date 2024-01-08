import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FENCE_NAMES } from 'common/fenceTypes';

import {
  fencesAllAclsSelector,
  fencesAtLeastOneAuthentificationConnectedSelector,
  fencesAuthorizedStudiesSelector,
  fencesSelector,
} from './selector';
import { fetchFenceAuthentificationStatus } from './thunks';

export type { InitialState as FencesInitialState } from './types';
export { default, FencesState } from './slice';

export const useFenceAuthentification = (fence: FENCE_NAMES) => {
  const dispatch = useDispatch();
  const state = useSelector(fencesSelector);

  useEffect(() => {
    dispatch(fetchFenceAuthentificationStatus(fence));
  }, []);

  return {
    ...state[fence],
  };
};

export const useAtLeastOneFenceConnected = () =>
  useSelector(fencesAtLeastOneAuthentificationConnectedSelector);

export const useAllFencesAcl = () => useSelector(fencesAllAclsSelector);

export const useFencesAuthorizedStudies = () => {
  const state = useSelector(fencesAuthorizedStudiesSelector);
  return {
    ...state,
  };
};
