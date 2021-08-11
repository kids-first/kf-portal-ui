import { Action } from 'redux';

import { addConnectionStatus, toggleIsConnecting } from 'store/actionCreators/cavatica';
import { logout } from 'store/actionCreators/user';
import { CavaticaState } from 'store/cavaticaTypes';
import { ConnectionStatus } from 'store/connectionTypes';
import { LogoutAction } from 'store/userTypes';

import reducer from '../cavatica';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState: CavaticaState = {
  isConnecting: false,
  isConnected: false,
  status: ConnectionStatus.unknown,
};

describe('Cavatica Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    // @ts-ignore compilation does not allow such action, but must be tested for vanilla javascript
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle toggleIsConnecting', () => {
    expect(reducer(initialState, toggleIsConnecting(true))).toEqual({
      isConnecting: true,
      isConnected: false,
      status: ConnectionStatus.unknown,
    });
  });

  it('should handle addConnectionStatus', () => {
    expect(reducer(initialState, addConnectionStatus(ConnectionStatus.connected))).toEqual({
      isConnecting: false,
      isConnected: true,
      status: ConnectionStatus.connected,
    });
  });

  it('should handle logout', () => {
    const state: CavaticaState = {
      isConnecting: false,
      isConnected: true,
      status: ConnectionStatus.connected,
    };
    expect(reducer(state, logout() as LogoutAction)).toEqual({
      ...initialState,
    });
  });
});
