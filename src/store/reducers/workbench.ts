import {
  ClusterUnverifiedStatus,
  WorkBenchActions,
  WorkBenchActionTypes,
  WorkBenchState,
} from '../WorkBenchTypes';

const initialState: WorkBenchState = {
  isLoading: true,
  error: null,
  status: ClusterUnverifiedStatus.unverified,
};

export default (state = initialState, action: WorkBenchActionTypes): WorkBenchState => {
  switch (action.type) {
    case WorkBenchActions.toggleLoading: {
      return { ...state, isLoading: action.isLoading };
    }
    case WorkBenchActions.addClusterStatus: {
      return { ...state, status: action.status };
    }
    case WorkBenchActions.failure: {
      return { ...initialState, error: action.error };
    }
    case WorkBenchActions.reInitialize: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
