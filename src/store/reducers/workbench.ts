import { LogoutAction, UserActions } from 'store/userTypes';
import {
  ClusterUnverifiedStatus,
  WorkBenchActions,
  WorkBenchActionTypes,
  WorkBenchState,
} from 'store/WorkBenchTypes';

const initialState: WorkBenchState = {
  isLoading: false,
  error: null,
  status: ClusterUnverifiedStatus.unverified,
  url: null,
};

export default (
  state = initialState,
  action: WorkBenchActionTypes | LogoutAction,
): WorkBenchState => {
  switch (action.type) {
    case WorkBenchActions.toggleLoading: {
      return { ...state, isLoading: action.isLoading };
    }
    case WorkBenchActions.addClusterStatus: {
      return { ...state, status: action.status, error: null, url: null };
    }
    case WorkBenchActions.failure: {
      return { ...initialState, error: action.error };
    }
    case WorkBenchActions.reInitialize: {
      return { ...initialState };
    }
    case WorkBenchActions.addClusterUrl: {
      return { ...state, url: action.url, error: null };
    }
    case WorkBenchActions.clearClusterError: {
      return { ...state, error: null };
    }
    case UserActions.logout: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
