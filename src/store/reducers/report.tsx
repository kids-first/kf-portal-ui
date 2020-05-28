import {
  RE_INITIALIZE_STATE,
  CLEAR_MESSAGE,
  FAILURE,
  ReportActionTypes,
  ReportState,
  REQUEST_MESSAGE,
  TOGGLE_LOADING,
} from '../reportTypes';

const initialState: ReportState = {
  isLoading: false,
  error: null,
  message: null,
};

export default (state = initialState, action: ReportActionTypes): ReportState => {
  switch (action.type) {
    case TOGGLE_LOADING: {
      return { ...state, isLoading: action.isLoading };
    }
    case REQUEST_MESSAGE: {
      return { ...state, message: action.message };
    }
    case FAILURE: {
      return { ...initialState, error: action.error };
    }
    case CLEAR_MESSAGE: {
      return { ...state, message: null };
    }
    case RE_INITIALIZE_STATE: {
      return initialState;
    }
    default:
      return state;
  }
};
