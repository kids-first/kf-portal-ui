import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { RootState } from './rootState';
import { Sqon } from './sqon';

export type VirtualStudyId = string;

export type Uid = string;

export type VirtualStudy = {
  activeIndex: number;
  creationDate: string;
  description: string;
  dirty: boolean;
  name: string;
  sharedPublicly: boolean;
  sqons: Sqon[];
  uid: Uid;
  virtualStudyId: VirtualStudyId;
};

export type VirtualStudyRaw = Pick<VirtualStudy, 'virtualStudyId' | 'uid' | 'name' | 'description'>;

export type VirtualStudyPlusId = VirtualStudy & { id: string };

export enum VirtualStudiesActions {
  FETCH_VIRTUAL_STUDIES_REQUESTED = 'FETCH_VIRTUAL_STUDIES_REQUESTED',
  FETCH_VIRTUAL_STUDIES_SUCCESS = 'FETCH_VIRTUAL_STUDIES_SUCCESS',
  FETCH_VIRTUAL_STUDIES_FAILURE = 'FETCH_VIRTUAL_STUDIES_FAILURE',

  VIRTUAL_STUDY_LOAD_REQUESTED = 'VIRTUAL_STUDY_LOAD_REQUESTED',
  VIRTUAL_STUDY_LOAD_SUCCESS = 'VIRTUAL_STUDY_LOAD_SUCCESS',
  VIRTUAL_STUDY_LOAD_FAILURE = 'VIRTUAL_STUDY_LOAD_FAILURE',

  VIRTUAL_STUDY_SAVE_REQUESTED = 'VIRTUAL_STUDY_SAVE_REQUESTED',
  VIRTUAL_STUDY_SAVE_SUCCESS = 'VIRTUAL_STUDY_SAVE_SUCCESS',
  VIRTUAL_STUDY_SAVE_FAILURE = 'VIRTUAL_STUDY_SAVE_FAILURE',

  VIRTUAL_STUDY_DELETE_REQUESTED = 'VIRTUAL_STUDY_DELETE_REQUESTED',
  VIRTUAL_STUDY_DELETE_SUCCESS = 'VIRTUAL_STUDY_DELETE_SUCCESS',
  VIRTUAL_STUDY_DELETE_FAILURE = 'VIRTUAL_STUDY_DELETE_FAILURE',
  VIRTUAL_STUDY_CLEAN_ERROR = 'VIRTUAL_STUDY_CLEAN_ERROR',
  ADD_TERM_TO_CURRENT_VIRTUAL_STUDY = 'ADD_TERM_TO_CURRENT_VIRTUAL_STUDY',

  VIRTUAL_STUDY_RESET = 'VIRTUAL_STUDY_RESET',

  SET_ACTIVE_INDEX = 'SET_ACTIVE_INDEX',
  SET_SELECTION_SQONS = 'SET_SELECTION_SQONS',
  SET_SQONS = 'SET_SQONS',
  SET_VIRTUAL_STUDY_ID = 'SET_VIRTUAL_STUDY_ID',
}

export type FetchVirtualStudiesRequestedAction = {
  type: VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_REQUESTED;
  payload: string;
};

export type FetchVirtualStudiesSuccessAction = {
  type: VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_SUCCESS;
  payload: VirtualStudy[];
};

export type FetchVirtualStudiesFailureAction = {
  type: VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_FAILURE;
  payload: Error;
};

export type VirtualStudyLoadRequestedAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_LOAD_REQUESTED;
  payload: string;
};

export type VirtualStudyLoadSuccessAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_LOAD_SUCCESS;
  payload: VirtualStudy;
};

export type VirtualStudyLoadFailureAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_LOAD_FAILURE;
  payload: string;
};

export type VirtualStudySaveRequestedAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_SAVE_REQUESTED;
  payload: VirtualStudy;
};

export type VirtualStudySaveSuccessAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_SAVE_SUCCESS;
  payload: VirtualStudyRaw;
};

export type VirtualStudySaveFailureAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_SAVE_FAILURE;
  payload: Error;
};

export type VirtualStudyDeleteRequestedAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_DELETE_REQUESTED;
  payload: string;
};

export type VirtualStudyDeleteSuccessAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_DELETE_SUCCESS;
  payload: string;
};

export type VirtualStudyDeleteFailureAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_DELETE_FAILURE;
  payload: Error;
};

export type ResetVirtualStudyAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_RESET;
  payload: null;
};

export type SetActiveIndexAction = {
  type: VirtualStudiesActions.SET_ACTIVE_INDEX;
  payload: number;
};

export type SetVirtualStudyId = {
  type: VirtualStudiesActions.SET_VIRTUAL_STUDY_ID;
  payload: string;
};

export type SetSqonAction = {
  type: VirtualStudiesActions.SET_SQONS;
  payload: Sqon | Sqon[];
};

export type SetSelectionSqonAction = {
  type: VirtualStudiesActions.SET_SELECTION_SQONS;
  payload: Sqon | Sqon[] | null;
};

export interface VirtualStudiesState {
  studies: VirtualStudy[];
  isLoading: boolean;
  error: Error | null;
}

export type AddTermToActiveIndexAction = {
  type: VirtualStudiesActions.ADD_TERM_TO_CURRENT_VIRTUAL_STUDY;
  payload: {
    term: Term;
    sqonOp?: string;
  };
};

export type CleanErrorAction = {
  type: VirtualStudiesActions.VIRTUAL_STUDY_CLEAN_ERROR;
};

export type Term = {
  field: string;
  value: string;
};

export type VirtualStudiesActionTypes =
  | FetchVirtualStudiesRequestedAction
  | FetchVirtualStudiesSuccessAction
  | FetchVirtualStudiesFailureAction
  | VirtualStudyLoadRequestedAction
  | VirtualStudyLoadSuccessAction
  | VirtualStudyLoadFailureAction
  | VirtualStudySaveRequestedAction
  | VirtualStudySaveSuccessAction
  | VirtualStudySaveFailureAction
  | VirtualStudyDeleteRequestedAction
  | VirtualStudyDeleteSuccessAction
  | VirtualStudyDeleteFailureAction
  | ResetVirtualStudyAction
  | SetActiveIndexAction
  | SetSqonAction
  | SetSelectionSqonAction
  | AddTermToActiveIndexAction
  | SetVirtualStudyId
  | CleanErrorAction;

export type DispatchVirtualStudies = ThunkDispatch<RootState, null, VirtualStudiesActionTypes>;
export type ThunkActionVirtualStudies = ThunkAction<
  void,
  RootState,
  null,
  VirtualStudiesActionTypes
>;
