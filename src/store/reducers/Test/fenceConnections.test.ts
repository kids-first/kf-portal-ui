import { Action } from 'redux';

import {
  addFenceConnection,
  addFenceStatus,
  removeFenceConnection,
  toggleIsFetchingAllFenceConnections,
} from 'store/actionCreators/fenceConnections';
import { MOCK_GEN3_CONNECTION } from 'store/actionCreators/Test/mockDataFence';
import { FenceConnectionsState } from 'store/fenceConnectionsTypes';
import { FenceName } from 'store/fenceTypes';
import reducer from 'store/reducers/fenceConnections';

import { ConnectionStatus } from '../../connectionTypes';

const DCF = FenceName.dcf;
const GEN3 = FenceName.gen3;

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState: FenceConnectionsState = {
  fenceConnections: {},
  statuses: { [GEN3]: ConnectionStatus.unknown, [DCF]: ConnectionStatus.unknown },
  isFetchingAllFenceConnections: false,
};

describe('Fence Connections Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle toggleIsFetchingAllFenceConnections', () => {
    expect(reducer(initialState, toggleIsFetchingAllFenceConnections(true))).toEqual({
      fenceConnections: {},
      isFetchingAllFenceConnections: true,
      statuses: { [GEN3]: ConnectionStatus.unknown, [DCF]: ConnectionStatus.unknown },
    });
  });

  it('should handle removeFenceConnection', () => {
    const state = {
      fenceConnections: { [GEN3]: MOCK_GEN3_CONNECTION },
      isFetchingAllFenceConnections: false,
      statuses: { [GEN3]: ConnectionStatus.unknown, [DCF]: ConnectionStatus.unknown },
    };
    expect(reducer(state, removeFenceConnection(GEN3))).toEqual({
      fenceConnections: {},
      isFetchingAllFenceConnections: false,
      statuses: { [GEN3]: ConnectionStatus.unknown, [DCF]: ConnectionStatus.unknown },
    });
  });

  it('should handle addFenceConnection', () => {
    const state = {
      fenceConnections: {},
      isFetchingAllFenceConnections: false,
      statuses: { [GEN3]: ConnectionStatus.unknown, [DCF]: ConnectionStatus.unknown },
    };
    expect(reducer(state, addFenceConnection(GEN3, MOCK_GEN3_CONNECTION))).toEqual({
      fenceConnections: { [GEN3]: MOCK_GEN3_CONNECTION },
      isFetchingAllFenceConnections: false,
      statuses: { [GEN3]: ConnectionStatus.unknown, [DCF]: ConnectionStatus.unknown },
    });
  });

  it('should handle addConnectionStatus', () => {
    const state = {
      fenceConnections: { [GEN3]: MOCK_GEN3_CONNECTION },
      isFetchingAllFenceConnections: false,
      statuses: { [GEN3]: ConnectionStatus.unknown, [DCF]: ConnectionStatus.unknown },
    };
    expect(reducer(state, addFenceStatus(GEN3, ConnectionStatus.connected))).toEqual({
      fenceConnections: { [GEN3]: MOCK_GEN3_CONNECTION },
      isFetchingAllFenceConnections: false,
      statuses: { [GEN3]: ConnectionStatus.connected, [DCF]: ConnectionStatus.unknown },
    });
  });
});
