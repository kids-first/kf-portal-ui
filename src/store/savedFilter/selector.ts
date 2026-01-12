import { initialState } from 'store/savedFilter/types';
import { RootState } from 'store/types';

export type SavedFilterProps = initialState;

export const savedFilterSelector = (state: RootState) => state.savedFilter;
