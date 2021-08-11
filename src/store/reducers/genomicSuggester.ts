import {
  GenomicActionTypes,
  GenomicSuggesterState,
  GenomicSuggesterTypes,
} from 'store/genomicSuggesterTypes';
import { LogoutAction, UserActions } from 'store/userTypes';

const initialState: GenomicSuggesterState = {
  searchText: '',
  isLoading: false,
  error: null,
  suggestions: [],
  selectedSuggestion: null,
};

export default (
  state = initialState,
  action: GenomicSuggesterTypes | LogoutAction,
): GenomicSuggesterState => {
  switch (action.type) {
    case GenomicActionTypes.TOGGLE_LOADING: {
      return { ...state, isLoading: action.isLoading };
    }
    case GenomicActionTypes.ADD_SUGGESTIONS: {
      return { ...state, suggestions: action.suggestions, searchText: action.searchText };
    }
    case GenomicActionTypes.SELECT_SUGGESTION: {
      return { ...state, selectedSuggestion: action.selectedSuggestion };
    }
    case GenomicActionTypes.FAILURE: {
      return { ...initialState, error: action.error };
    }
    case GenomicActionTypes.CLEAR_SUGGESTIONS: {
      return { ...state, suggestions: [], searchText: '' };
    }
    case UserActions.logout:
    case GenomicActionTypes.RE_INITIALIZE_STATE: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
