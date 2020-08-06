import { ThunkDispatch } from 'redux-thunk';
import { Sqon } from './sqon';
import { RootState } from './rootState';

export const TOGGLE_PENDING_CREATE = 'TOGGLE_PENDING_CREATE_SAVE_SET';
export const FAILURE_CREATE = 'FAILURE_CREATE_SAVE_SETS';
export const TAG_NAME_CONFLICT = 'TAG_NAME_CONFLICT';
export const RE_INITIALIZE_STATE = 'RE_INITIALIZE_SAVE_SET';

interface TogglePendingCreate {
  type: typeof TOGGLE_PENDING_CREATE;
  isPending: boolean;
}

interface Failure {
  type: typeof FAILURE_CREATE;
  error: Error | null;
}

interface ReInitializedState {
  type: typeof RE_INITIALIZE_STATE;
}

interface ToggleTagNameExist {
  type: typeof TAG_NAME_CONFLICT;
  hasSameTagName: boolean;
}

export type SaveSetsActionTypes =
  | TogglePendingCreate
  | Failure
  | ReInitializedState
  | ToggleTagNameExist;

export type DispatchSaveSets = ThunkDispatch<RootState, null, SaveSetsActionTypes>;

export interface SaveSetState {
  create: {
    isLoading: boolean;
    error?: Error | null;
    tagNameConflict: boolean;
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
