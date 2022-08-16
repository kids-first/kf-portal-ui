import { useSelector } from 'react-redux';
import { globalSelector } from './selector';

export type { initialState as GlobalInitialState } from './types';
export { default, GlobalState, globalActions } from './slice';
export const useGlobals = () => useSelector(globalSelector);
export const useLang = () =>
  useSelector(globalSelector, (left, right) => left.lang === right.lang).lang;
