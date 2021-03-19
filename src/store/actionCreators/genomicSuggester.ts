import {
  ADD_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
  FAILURE,
  GenomicSuggesterTypes,
  RE_INITIALIZE_STATE,
  SELECT_SUGGESTION,
  TOGGLE_LOADING,
} from '../genomicSuggesterTypes';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../rootState';
import { getGenomicSuggestions } from 'services/genomicSuggestions';
import { SearchText, SelectedSuggestion, Suggestion } from '../graphql/variants/models';

export const toggleLoading = (isLoading: boolean): GenomicSuggesterTypes => ({
  type: TOGGLE_LOADING,
  isLoading,
});

export const selectChosenSuggestion = ({
  suggestionId,
  featureType,
  geneSymbol,
}: SelectedSuggestion): GenomicSuggesterTypes => ({
  type: SELECT_SUGGESTION,
  selectedSuggestion: {
    featureType,
    suggestionId,
    geneSymbol,
  },
});

export const failure = (error: Error): GenomicSuggesterTypes => ({
  type: FAILURE,
  error,
});

export const addSuggestions = (
  searchText: SearchText,
  suggestions: Suggestion[],
): GenomicSuggesterTypes => ({
  type: ADD_SUGGESTIONS,
  suggestions,
  searchText,
});

export const clearSuggestions = (): GenomicSuggesterTypes => ({
  type: CLEAR_SUGGESTIONS,
});

export const reInitializeState = (): GenomicSuggesterTypes => ({
  type: RE_INITIALIZE_STATE,
});

export const fetchSuggestions = (
  searchText: SearchText,
): ThunkAction<void, RootState, null, GenomicSuggesterTypes> => async (dispatch) => {
  dispatch(clearSuggestions());
  dispatch(toggleLoading(true));
  try {
    const response: { searchText: string; suggestions: Suggestion[] } = await getGenomicSuggestions(
      searchText,
    );
    dispatch(addSuggestions(response.searchText, response.suggestions));
  } catch (e) {
    dispatch(failure(e));
    dispatch(clearSuggestions());
  } finally {
    dispatch(toggleLoading(false));
  }
};
