import { Sqon } from './sqon';
import { ADD_TERM_TO_CURRENT_VIRTUAL_STUDY } from './actionTypes';

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
