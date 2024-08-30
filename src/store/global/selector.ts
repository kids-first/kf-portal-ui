import { initialState } from 'store/global/types';
import { RootState } from 'store/types';

export type GlobalProps = initialState;

export const globalSelector = (state: RootState) => state.global;
