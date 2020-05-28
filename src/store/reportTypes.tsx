import { Sqon } from './sqon';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './rootState';

export const TOGGLE_LOADING = 'TOGGLE_LOADING';
export const REQUEST_MESSAGE = 'REQUEST_MESSAGE';
export const FAILURE = 'FAILURE';
export const RE_INITIALIZE_STATE = 'RE_INITIALIZE_STATE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

export enum MessageType {
  INFO = 'info',
  WARN = 'warning',
  LOADING = 'loading',
}

export interface Message {
  type: MessageType;
  content: string;
  duration: number;
}
export interface ReportState {
  isLoading: boolean;
  error?: Error | null;
  message?: Message | null;
}

export interface ReportConfig {
  sqon: Sqon;
  name: string;
}

interface RequestMessage {
  type: typeof REQUEST_MESSAGE;
  message: Message | null;
}

interface Failure {
  type: typeof FAILURE;
  error: Error | null;
}

interface ReInitializedState {
  type: typeof RE_INITIALIZE_STATE;
}

interface ClearMessage {
  type: typeof CLEAR_MESSAGE;
}

interface ToggleLoading {
  type: typeof TOGGLE_LOADING;
  isLoading: boolean;
}

export type ReportActionTypes =
  | RequestMessage
  | Failure
  | ReInitializedState
  | ClearMessage
  | ToggleLoading;

export type DispatchReport = ThunkDispatch<RootState, null, ReportActionTypes>;
