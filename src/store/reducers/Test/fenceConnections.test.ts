import { Action } from 'redux';

import {
  addFenceConnectError,
  addFenceConnection,
  addFenceDisconnectError,
  addFenceStatus,
  removeFenceConnectError,
  removeFenceConnection,
  removeFenceDisconnectError,
  toggleIsFetchingAllFenceConnections,
  toggleIsFetchingOneFenceConnection,
} from 'store/actionCreators/fenceConnections';
import { MOCK_GEN3_CONNECTION } from 'store/actionCreators/Test/mockDataFence';
import { logout } from 'store/actionCreators/user';
import { ConnectionStatus } from 'store/connectionTypes';
import { FenceConnectionsState } from 'store/fenceConnectionsTypes';
import { AllFencesNames, FenceName } from 'store/fenceTypes';
import reducer from 'store/reducers/fenceConnections';
import { LogoutAction } from 'store/userTypes';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState: FenceConnectionsState = {
  fenceConnections: {},
  statuses: {
    [FenceName.gen3]: ConnectionStatus.unknown,
    [FenceName.dcf]: ConnectionStatus.unknown,
  },
  loadingFences: [],
  fencesConnectError: [],
  fencesDisConnectError: [],
};

describe('Fence Connections Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle toggleIsFetchingAllFenceConnections', () => {
    expect(reducer(initialState, toggleIsFetchingAllFenceConnections(true))).toEqual({
      ...initialState,
      loadingFences: [...AllFencesNames],
    });
  });

  it('should handle toggleIsFetchingOneFenceConnection', () => {
    expect(reducer(initialState, toggleIsFetchingOneFenceConnection(true, FenceName.gen3))).toEqual(
      {
        ...initialState,
        loadingFences: [FenceName.gen3],
      },
    );
  });

  it('should handle removeFenceConnection', () => {
    const state = {
      ...initialState,
      fenceConnections: { [FenceName.gen3]: MOCK_GEN3_CONNECTION },
    };
    expect(reducer(state, removeFenceConnection(FenceName.gen3))).toEqual({
      ...initialState,
      fenceConnections: {},
    });
  });

  it('should handle addFenceConnection', () => {
    expect(reducer(initialState, addFenceConnection(FenceName.gen3, MOCK_GEN3_CONNECTION))).toEqual(
      {
        ...initialState,
        fenceConnections: { [FenceName.gen3]: MOCK_GEN3_CONNECTION },
      },
    );
  });

  it('should handle addConnectionStatus', () => {
    const state = {
      ...initialState,
      fenceConnections: { [FenceName.gen3]: MOCK_GEN3_CONNECTION },
    };
    expect(reducer(state, addFenceStatus(FenceName.gen3, ConnectionStatus.connected))).toEqual({
      ...initialState,
      fenceConnections: { [FenceName.gen3]: MOCK_GEN3_CONNECTION },
      statuses: {
        [FenceName.gen3]: ConnectionStatus.connected,
        [FenceName.dcf]: ConnectionStatus.unknown,
      },
    });
  });

  it('should handle addFenceConnectError', () => {
    expect(reducer(initialState, addFenceConnectError(FenceName.gen3))).toEqual({
      ...initialState,
      fencesConnectError: [FenceName.gen3],
    });
    const state = {
      ...initialState,
      fencesConnectError: [FenceName.gen3],
    };
    expect(reducer(state, addFenceConnectError(FenceName.gen3))).toEqual({
      ...state,
    });
  });

  it('should handle removeFenceConnectError', () => {
    const state = {
      ...initialState,
      fencesConnectError: [FenceName.gen3, FenceName.dcf],
    };
    expect(reducer(state, removeFenceConnectError(FenceName.gen3))).toEqual({
      ...initialState,
      fencesConnectError: [FenceName.dcf],
    });
  });

  it('should handle addFenceDisconnectError', () => {
    expect(reducer(initialState, addFenceDisconnectError(FenceName.gen3))).toEqual({
      ...initialState,
      fencesDisConnectError: [FenceName.gen3],
    });
    const state = {
      ...initialState,
      fencesDisConnectError: [FenceName.gen3],
    };
    expect(reducer(state, addFenceDisconnectError(FenceName.gen3))).toEqual({
      ...state,
    });
  });

  it('should handle removeFenceDisconnectError', () => {
    const state = {
      ...initialState,
      fencesDisConnectError: [FenceName.gen3, FenceName.dcf],
    };
    expect(reducer(state, removeFenceDisconnectError(FenceName.gen3))).toEqual({
      ...initialState,
      fencesDisConnectError: [FenceName.dcf],
    });
  });

  it('should handle logout', () => {
    const state = {
      ...initialState,
      fenceConnections: { [FenceName.gen3]: MOCK_GEN3_CONNECTION },
    };
    expect(reducer(state, logout() as LogoutAction)).toEqual({
      ...initialState,
    });
  });
});
