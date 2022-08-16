import { RootState } from 'store/types';
import { initialState } from 'store/fenceCavatica/types';

export type FenceCavaticaProps = initialState;

export const fenceCavaticaSelector = (state: RootState) => {
  return state.fenceCavatica;
};
