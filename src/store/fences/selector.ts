import { RootState } from 'store/types';

import { initialState } from './types';

export type FencesProps = initialState;

export const fencesSelector = (state: RootState) => state.fences;
export const fencesAuthorizedStudiesSelector = (state: RootState) => state.fences.authorizedStudies;
