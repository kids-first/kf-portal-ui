import { ReportActions, ReportActionTypes, ReportState } from '../reportTypes';

const initialState: ReportState = {
  isLoading: false,
  error: null,
  message: null,
};

export default (state = initialState, action: ReportActionTypes): ReportState => {
  switch (action.type) {
    case ReportActions.TOGGLE_LOADING: {
      return { ...state, isLoading: action.isLoading };
    }
    case ReportActions.REQUEST_MESSAGE: {
      return { ...state, message: action.message };
    }
    case ReportActions.FAILURE: {
      return { ...initialState, error: action.error };
    }
    case ReportActions.CLEAR_MESSAGE: {
      return { ...state, message: null };
    }
    case ReportActions.RE_INITIALIZE_STATE: {
      return initialState;
    }
    default:
      return state;
  }
};
