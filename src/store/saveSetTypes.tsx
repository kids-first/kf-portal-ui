import { ThunkDispatch } from 'redux-thunk';
import { Sqon } from './sqon';
import { RootState } from './rootState';

export const TOGGLE_PENDING_CREATE = 'TOGGLE_PENDING_CREATE_SAVE_SET';
export const FAILURE_CREATE = 'FAILURE_CREATE_SAVE_SETS';
export const RE_INITIALIZE_STATE = 'RE_INITIALIZE_SAVE_SET';
export const TOGGLE_LOADING_SAVE_SETS = 'TOGGLE_LOADING_SAVE_SETS';
export const USER_SAVE_SETS = 'USER_SAVE_SETS';
export const FAILURE_LOAD_SAVE_SETS = 'FAILURE_LOAD_SAVE_SETS';
export const TOGGLE_IS_DELETING_SAVE_SETS = 'TOGGLE_IS_DELETING_SAVE_SETS';
export const TOGGLE_IS_ADD_DELETE_TO_SET = 'TOGGLE_IS_ADD_DELETE_TO_SET';
export const REMOVE_USER_SAVE_SETS = 'REMOVE_USER_SAVE_SETS';
export const EDIT_SAVE_SET_TAG = 'EDIT_SAVE_SET_TAG';
export const CREATE_SET_QUERY_REQUEST = 'CREATE_QUERY_REQUEST';
export const DELETE_SET_QUERY_REQUEST = 'DELETE_SET_QUERY_REQUEST';
export const ADD_SET_TO_CURRENT_QUERY = 'ADD_SET_TO_CURRENT_QUERY';

export type SetInfo = {
  key: string;
  name: string;
  count?: number;
  currentUser: string;
};

export type AddRemoveSetParams = {
  userId: string;
  setId: string;
  onSuccess: Function;
  onFail: Function;
  subActionType: SetSubActionTypes;
  sqon: Sqon;
  type: string;
  path: string;
};

interface TogglePendingCreate {
  type: typeof TOGGLE_PENDING_CREATE;
  isPending: boolean;
}

interface FailureCreate {
  type: typeof FAILURE_CREATE;
  error: Error | null;
}

interface ReInitializedState {
  type: typeof RE_INITIALIZE_STATE;
}

interface IsLoadingSaveSets {
  type: typeof TOGGLE_LOADING_SAVE_SETS;
  isLoading: boolean;
}

interface DisplayUserSaveSets {
  type: typeof USER_SAVE_SETS;
  payload: UserSet[];
}

interface FailureLoadSaveSets {
  type: typeof FAILURE_LOAD_SAVE_SETS;
  error: Error | null;
}

interface IsDeletingSaveSets {
  type: typeof TOGGLE_IS_DELETING_SAVE_SETS;
  isDeleting: boolean;
}

interface isAddingOrRemovingToSet {
  type: typeof TOGGLE_IS_ADD_DELETE_TO_SET;
  isEditing: boolean;
}

interface RemoveUserSets {
  type: typeof REMOVE_USER_SAVE_SETS;
  sets: string[];
}

interface EditSetTag {
  type: typeof EDIT_SAVE_SET_TAG;
  set: SetInfo;
}

interface CreateQueryInCohortBuilder {
  type: typeof CREATE_SET_QUERY_REQUEST;
  setId: string;
}

interface AddSetToCurrentQuery {
  type: typeof ADD_SET_TO_CURRENT_QUERY;
  setId: string;
}

export type DispatchSaveSets = ThunkDispatch<RootState, null, SetsActionTypes>;

export type SetsActionTypes =
  | TogglePendingCreate
  | FailureCreate
  | ReInitializedState
  | IsLoadingSaveSets
  | DisplayUserSaveSets
  | IsDeletingSaveSets
  | RemoveUserSets
  | EditSetTag
  | isAddingOrRemovingToSet
  | FailureLoadSaveSets
  | CreateQueryInCohortBuilder
  | AddSetToCurrentQuery;

export type UserSet = {
  setId: string;
  size: number;
  tag: string;
};

export interface UserSetsState {
  isLoading: boolean;
  error?: Error | null;
  sets: UserSet[];
  isDeleting: boolean;
  isEditing: boolean;
}

export interface SaveSetState {
  create: {
    isLoading: boolean;
    error?: Error | null;
  };
  userSets: UserSetsState;
}

export type SaveSetParams = {
  tag: string;
  userId: string;
  sqon: Sqon;
  // sets: UserSaveSets[];
  onSuccess: Function;
  onNameConflict: Function;
};

export type EditSetTagParams = {
  setInfo: SetInfo;
  onSuccess: Function;
  onFail: Function;
  onNameConflict: Function;
};

export type DeleteSetParams = {
  setIds: string[];
  onFail: Function;
};

export class SetNameConflictError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'SaveSetNameConflictError';
  }
}

export const isSaveSetNameConflictError = (e?: Error | null) => e instanceof SetNameConflictError;

export enum SaveSetActionsTypes {
  CREATE = 'create',
  EDIT = 'edit',
}

export enum SetSourceType {
  QUERY = 'QUERY',
  SAVE_SET = 'SAVE_SET',
}

export enum SetSubActionTypes {
  RENAME_TAG = 'RENAME_TAG',
  ADD_IDS = 'ADD_IDS',
  REMOVE_IDS = 'REMOVE_IDS',
}

export type SetUpdateSource = {
  sourceType: SetUpdateSource;
};

export type SetUpdateInputData = {
  type?: string;
  sqon?: Sqon;
  path?: string;
  newTag?: string;
};
