import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './rootState';
import { setSqonArrangerCB } from './sqon';

export enum EntityName {
  PARTICIPANT = 'PARTICIPANT',
  BIOSPECIMEN = 'BIOSPECIMEN',
  FILE = 'FILE',
}

export const TOGGLE_LOADING = 'TOGGLE_LOADING_FILES_SEARCH';
export const FAILURE = 'FAILURE_FILES_SEARCH';
export const RE_INITIALIZE_STATE = 'RE_INITIALIZE_STATE_FILES_SEARCH';

interface ToggleLoading {
  type: typeof TOGGLE_LOADING;
  isLoading: boolean;
  entityName: EntityName;
}

interface Failure {
  type: typeof FAILURE;
  error: Error | null;
  entityName: EntityName;
}

interface ReInitializedState {
  type: typeof RE_INITIALIZE_STATE;
  entityName: EntityName;
}

export interface FileSearchFilterSubState {
  isLoading: boolean;
  error?: Error | null;
}

export interface FileSearchFiltersState {
  [EntityName.PARTICIPANT]: FileSearchFilterSubState;
  [EntityName.BIOSPECIMEN]: FileSearchFilterSubState;
  [EntityName.FILE]: FileSearchFilterSubState;
}

export interface SearchConfig {
  id: string;
  entityName: EntityName;
  setArrangerSqonCB: setSqonArrangerCB;
}

export type FileSearchFiltersActionTypes = ToggleLoading | Failure | ReInitializedState;

export type DispatchFileSearchFilters = ThunkDispatch<
  RootState,
  null,
  FileSearchFiltersActionTypes
>;
