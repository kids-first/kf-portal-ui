import {
  ADD_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
  FAILURE,
  GenomicSuggesterState,
  GenomicSuggesterTypes,
  RE_INITIALIZE_STATE,
  SELECT_SUGGESTION,
  TOGGLE_LOADING,
} from '../genomicSuggesterTypes';

const initialState: GenomicSuggesterState = {
  searchText: '',
  isLoading: false,
  error: null,
  suggestions: [],
  selectedSuggestion: null,
};

export default (state = initialState, action: GenomicSuggesterTypes): GenomicSuggesterState => {
  switch (action.type) {
    case TOGGLE_LOADING: {
      return { ...state, isLoading: action.isLoading };
    }
    case ADD_SUGGESTIONS: {
      return { ...state, suggestions: action.suggestions, searchText: action.searchText };
    }
    case SELECT_SUGGESTION: {
      return { ...state, selectedSuggestion: action.selectedSuggestion };
    }
    case FAILURE: {
      return { ...initialState, error: action.error };
    }
    case CLEAR_SUGGESTIONS: {
      return { ...state, suggestions: [], searchText: '' };
    }
    case RE_INITIALIZE_STATE: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
