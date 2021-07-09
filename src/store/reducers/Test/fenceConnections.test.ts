import { Action } from 'redux';

import { GEN3 } from 'common/constants';
import {
  addFenceConnection,
  removeFenceConnection,
  toggleIsFetchingAllFenceConnections,
} from 'store/actionCreators/fenceConnections';
import { MOCK_GEN3_CONNECTION } from 'store/actionCreators/Test/mockDataFence';
import { FenceConnectionsState } from 'store/fenceConnectionsTypes';
import reducer from 'store/reducers/fenceConnections';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState: FenceConnectionsState = {
  fenceConnections: {},
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
    });
  });

  it('should handle removeFenceConnection', () => {
    const state = {
      fenceConnections: { [GEN3]: MOCK_GEN3_CONNECTION },
      isFetchingAllFenceConnections: false,
    };
    expect(reducer(state, removeFenceConnection(GEN3))).toEqual({
      fenceConnections: {},
      isFetchingAllFenceConnections: false,
    });
  });

  it('should handle addFenceConnection', () => {
    const state = {
      fenceConnections: {},
      isFetchingAllFenceConnections: false,
    };
    expect(reducer(state, addFenceConnection(GEN3, MOCK_GEN3_CONNECTION))).toEqual({
      fenceConnections: { [GEN3]: MOCK_GEN3_CONNECTION },
      isFetchingAllFenceConnections: false,
    });
  });
});
