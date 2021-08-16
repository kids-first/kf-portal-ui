import { ThunkDispatch } from 'redux-thunk';

import { ConnectionStatus } from './connectionTypes';
import { RootState } from './rootState';

export enum CavaticaActions {
  toggleIsConnecting = 'toggleIsConnecting',
  addConnectionStatus = 'addConnectionStatus',
}

export type ToggleIsConnecting = {
  type: CavaticaActions.toggleIsConnecting;
  isChecking: boolean;
};

export type AddConnectionStatus = {
  type: CavaticaActions.addConnectionStatus;
  newStatus: ConnectionStatus;
};

export type CavaticaState = {
  isConnecting: boolean;
  isConnected: boolean;
  status: ConnectionStatus;
};

export type CavaticaActionTypes = ToggleIsConnecting | AddConnectionStatus;

export type DispatchCavatica = ThunkDispatch<RootState, null, CavaticaActionTypes>;
