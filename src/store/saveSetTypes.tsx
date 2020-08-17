import { ThunkDispatch } from 'redux-thunk';
import { Sqon } from './sqon';
import { RootState } from './rootState';

export const TOGGLE_PENDING_CREATE = 'TOGGLE_PENDING_CREATE_SAVE_SET';
export const FAILURE_CREATE = 'FAILURE_CREATE_SAVE_SETS';
export const RE_INITIALIZE_STATE = 'RE_INITIALIZE_SAVE_SET';
export const TOGGLE_LOADING_SAVE_SETS = 'TOGGLE_LOADING_SAVE_SETS';
export const USER_SAVE_SETS = 'USER_SAVE_SETS';
export const FAILURE_LOAD_SAVE_SETS = 'FAILURE_LOAD_SAVE_SETS';

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
  payload: UserSaveSets[];
}

interface FailureLoadSaveSets {
  type: typeof FAILURE_LOAD_SAVE_SETS;
  error: Error | null;
}

export type SaveSetsActionTypes =
  | TogglePendingCreate
  | FailureCreate
  | ReInitializedState
  | IsLoadingSaveSets
  | DisplayUserSaveSets
  | FailureLoadSaveSets;

export type DispatchSaveSets = ThunkDispatch<RootState, null, SaveSetsActionTypes>;

export type UserSaveSets = {
  setId: string;
  size: number;
  tag: string;
};

export interface SaveSetState {
  create: {
    isLoading: boolean;
    error?: Error | null;
  };
  userSets: {
    isLoading: boolean;
    error?: Error | null;
    sets: UserSaveSets[];
  };
}

export type SaveSetParams = {
  tag: string;
  userId: string;
  api: Function;
  sqon: Sqon;
  onSuccess: Function;
  onNameConflict: Function;
};

export class SaveSetNameConflictError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'SaveSetNameConflictError';
  }
}

export const isSaveSetNameConflictError = (e?: Error | null) =>
  e instanceof SaveSetNameConflictError;
