import { ThunkDispatch } from 'redux-thunk';

import { RootState } from './rootState';
import { Sqon } from './sqon';
import { ADD_TERM_TO_CURRENT_VIRTUAL_STUDY } from './virtualStudiesActionTypes';

export type VirtualStudy = {
  activeIndex: number;
  creationDate: string;
  description: string;
  dirty: boolean;
  name: string;
  sharedPublicly: boolean;
  sqons: Sqon[];
  uid: string;
  virtualStudyId: string;
};

export type VirtualStudyPlusId = VirtualStudy & { id: string };

export interface VirtualStudiesState {
  studies: VirtualStudy[];
  isLoading: boolean;
  error: Error | null;
}

export interface AddTermToActiveIndex {
  type: typeof ADD_TERM_TO_CURRENT_VIRTUAL_STUDY;
  payload: {
    term: Term;
  };
}

export type Term = {
  field: string;
  value: string;
};

export type DispatchVirtualStudies = ThunkDispatch<RootState, null, any>;
