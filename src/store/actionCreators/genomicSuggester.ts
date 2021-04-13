import { GenomicActionTypes, GenomicSuggesterTypes } from '../genomicSuggesterTypes';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../rootState';
import { getGenomicSuggestions } from 'services/genomicSuggestions';
import { SearchText, SelectedSuggestion, Suggestion } from '../graphql/variants/models';

export const toggleLoading = (isLoading: boolean): GenomicSuggesterTypes => ({
  type: GenomicActionTypes.TOGGLE_LOADING,
  isLoading,
});

export const selectChosenSuggestion = ({
  suggestionId,
  featureType,
  geneSymbol,
  displayName,
}: SelectedSuggestion): GenomicSuggesterTypes => ({
  type: GenomicActionTypes.SELECT_SUGGESTION,
  selectedSuggestion: {
    featureType,
    suggestionId,
    geneSymbol,
    displayName,
  },
});

export const failure = (error: Error): GenomicSuggesterTypes => ({
  type: GenomicActionTypes.FAILURE,
  error,
});

export const addSuggestions = (
  searchText: SearchText,
  suggestions: Suggestion[],
): GenomicSuggesterTypes => ({
  type: GenomicActionTypes.ADD_SUGGESTIONS,
  suggestions,
  searchText,
});

export const clearSuggestions = (): GenomicSuggesterTypes => ({
  type: GenomicActionTypes.CLEAR_SUGGESTIONS,
});

export const reInitializeState = (): GenomicSuggesterTypes => ({
  type: GenomicActionTypes.RE_INITIALIZE_STATE,
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
