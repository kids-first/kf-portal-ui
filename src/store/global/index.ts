import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { globalSelector } from './selector';
import { fetchStats } from './thunks';

export type { initialState as GlobalInitialState } from './types';
export { default, GlobalState, globalActions } from './slice';
export const useGlobals = () => useSelector(globalSelector);
export const useLang = () =>
  useSelector(globalSelector, (left, right) => left.lang === right.lang).lang;

export const useStats = () => {
  const state = useSelector(globalSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStats());
  }, []);
  return state.stats;
};
