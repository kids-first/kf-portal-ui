import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ISearchParams } from '@ferlab/ui/core/pages/CommunityPage';

import { communitySelector } from './selector';
import { fetchCommunityUsers } from './thunks';

export type { initialState as CommunityInitialState } from './types';
export { default, CommunityState } from './slice';

export const useCommunityUsers = (searchParams: ISearchParams) => {
  const state = useSelector(communitySelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCommunityUsers(searchParams));
  }, [searchParams]);

  return state;
};
