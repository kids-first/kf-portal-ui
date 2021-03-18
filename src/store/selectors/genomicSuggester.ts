import { RootState } from '../rootState';

export const selectIsLoading = (state: RootState) => state.genomicSuggester.isLoading;
export const selectError = (state: RootState) => state.genomicSuggester.error;
export const selectSuggestions = (state: RootState) => state.genomicSuggester.suggestions;
export const selectSearchText = (state: RootState) => state.genomicSuggester.searchText;
export const selectChosenSuggestion = (state: RootState) =>
  state.genomicSuggester.selectedSuggestion;
export const selectSearchTextSuggestion = (state: RootState) => state.genomicSuggester.searchText;
