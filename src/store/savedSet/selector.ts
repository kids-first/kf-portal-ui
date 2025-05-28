import { initialState } from 'store/savedFilter/types';
import { RootState } from 'store/types';

export type SavedSetProps = initialState;

export const savedSetSelector = (state: RootState) => state.savedSet;
