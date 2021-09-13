import omit from 'lodash/omit';
import uniq from 'lodash/uniq';

import {
  FenceConnectionsActions,
  FenceConnectionsActionTypes,
  fenceConnectionsInitialState,
  FenceConnectionsState,
} from '../fenceConnectionsTypes';
import { AllFencesNames } from '../fenceTypes';
import { LogoutAction, UserActions } from '../userTypes';

const initialState: FenceConnectionsState = {
  ...fenceConnectionsInitialState,
};

export default (
  state = initialState,
  action: FenceConnectionsActionTypes | LogoutAction,
): FenceConnectionsState => {
  switch (action.type) {
    case FenceConnectionsActions.toggleIsFetchingOneFenceConnection: {
      const fenceName = action.fenceName;
      const isLoading = action.isLoading;
      const oldLoadingFences = [...state.loadingFences];
      return {
        ...state,
        loadingFences: isLoading
          ? uniq([...oldLoadingFences, fenceName])
          : oldLoadingFences.filter((f) => f !== fenceName),
      };
    }
    case FenceConnectionsActions.toggleIsFetchingAllFenceConnections: {
      const loadingFences = action.isLoading ? [...AllFencesNames] : [];
      return {
        ...state,
        loadingFences: loadingFences,
      };
    }
    case FenceConnectionsActions.removeFenceConnection: {
      return { ...state, fenceConnections: omit(state.fenceConnections, [action.fenceName]) };
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
    case FenceConnectionsActions.removeAllFencesConnection: {
      return { ...state, fenceConnections: {} };
    }
    case FenceConnectionsActions.addConnectionStatus: {
      return {
        ...state,
        statuses: {
          ...state.statuses,
          [action.fenceName]: action.newStatus,
        },
      };
    }
    case FenceConnectionsActions.addFenceConnectError: {
      return {
        ...state,
        fencesConnectError: uniq([...state.fencesConnectError, action.fenceName]),
      };
    }
    case FenceConnectionsActions.removeFenceConnectError: {
      return {
        ...state,
        fencesConnectError: [...state.fencesConnectError].filter(
          (fName) => fName !== action.fenceName,
        ),
      };
    }
    case FenceConnectionsActions.addFenceDisconnectError: {
      return {
        ...state,
        fencesDisConnectError: uniq([...state.fencesDisConnectError, action.fenceName]),
      };
    }
    case FenceConnectionsActions.removeFenceDisconnectError: {
      return {
        ...state,
        fencesDisConnectError: [...state.fencesDisConnectError].filter(
          (fName) => fName !== action.fenceName,
        ),
      };
    }
    case UserActions.logout: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
