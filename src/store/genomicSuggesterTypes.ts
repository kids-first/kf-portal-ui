import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './rootState';
import { SearchText, SelectedSuggestion, Suggestion } from './graphql/variants/models';

export const TOGGLE_LOADING = 'TOGGLE_LOADING_GENOMIC_SUGGESTER';
export const FAILURE = 'FAILURE_GENOMIC_SUGGESTER';
export const RE_INITIALIZE_STATE = 'RE_INITIALIZE_STATE_GENOMIC_SUGGESTER';
export const CLEAR_SUGGESTIONS = 'CLEAR_MESSAGE_GENOMIC_SUGGESTER';
export const ADD_SUGGESTIONS = 'ADD_SUGGESTIONS_GENOMIC_SUGGESTER';
export const SELECT_SUGGESTION = 'SELECT_SUGGESTION_GENOMIC_SUGGESTER';

export type SelectedSuggestionAction = {
  type: typeof SELECT_SUGGESTION;
  selectedSuggestion: SelectedSuggestion;
};

type AddSuggestions = {
  type: typeof ADD_SUGGESTIONS;
  suggestions: Suggestion[];
  searchText: SearchText;
};

type Failure = {
  type: typeof FAILURE;
  error: Error | null;
};

type ReInitializeState = {
  type: typeof RE_INITIALIZE_STATE;
};

type ClearSuggestions = {
  type: typeof CLEAR_SUGGESTIONS;
};

type ToggleLoading = {
  type: typeof TOGGLE_LOADING;
  isLoading: boolean;
};

export type GenomicSuggesterState = {
  searchText: string | undefined;
  isLoading: boolean;
  error: Error | null | undefined;
  suggestions: Suggestion[];
  selectedSuggestion: SelectedSuggestion | null | undefined;
};

export type GenomicSuggesterTypes =
  | Failure
  | SelectedSuggestionAction
  | ReInitializeState
  | ClearSuggestions
  | ToggleLoading
  | AddSuggestions;

export type DispatchGenomicSuggester = ThunkDispatch<RootState, null, GenomicSuggesterTypes>;
