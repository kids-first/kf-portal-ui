import {
  FenceConnectionsActions,
  FenceConnectionsActionTypes,
  FenceConnectionsState,
} from '../fenceConnectionsTypes';

const initialState: FenceConnectionsState = {
  fenceConnections: {},
  isFetchingAllFenceConnections: false,
};

export default (
  state = initialState,
  action: FenceConnectionsActionTypes,
): FenceConnectionsState => {
  switch (action.type) {
    case FenceConnectionsActions.toggleIsFetchingAllFenceConnections: {
      return { ...state, isFetchingAllFenceConnections: action.isLoading };
    }
    case FenceConnectionsActions.addFenceConnection: {
      return {
        ...state,
        fenceConnections: {
          ...state.fenceConnections,
          [action.fenceName]: { ...action.connection },
        },
      };
    }
    default:
      return state;
  }
};
