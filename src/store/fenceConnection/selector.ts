import { RootState } from 'store/types';
import { initialState } from 'store/fenceConnection/types';

export type FenceConnectionProps = initialState;

export const fenceConnectionSelector = (state: RootState) => {
  return state.fenceConnection;
};
