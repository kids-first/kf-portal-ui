import { ThunkDispatch } from 'redux-thunk';

import { RootState } from './rootState';
import { Sqon } from './sqon';

export enum ReportActions {
  TOGGLE_LOADING = 'TOGGLE_LOADING_RP',
  REQUEST_MESSAGE = 'REQUEST_MESSAGE_RP',
  FAILURE = 'FAILURE_RP',
  RE_INITIALIZE_STATE = 'RE_INITIALIZE_STATE_RP',
  CLEAR_MESSAGE = 'CLEAR_MESSAGE_RP',
}

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
  type: ReportActions.REQUEST_MESSAGE;
  message: Message | null;
}

interface Failure {
  type: ReportActions.FAILURE;
  error: Error | null;
}

interface ReInitializedState {
  type: ReportActions.RE_INITIALIZE_STATE;
}

interface ClearMessage {
  type: ReportActions.CLEAR_MESSAGE;
}

interface ToggleLoading {
  type: ReportActions.TOGGLE_LOADING;
  isLoading: boolean;
}

export type ReportActionTypes =
  | RequestMessage
  | Failure
  | ReInitializedState
  | ClearMessage
  | ToggleLoading;

export type DispatchReport = ThunkDispatch<RootState, null, ReportActionTypes>;
