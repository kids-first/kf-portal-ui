import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './rootState';
import { SearchText, SelectedSuggestion, Suggestion } from './graphql/variants/models';

export enum GenomicActionTypes {
  TOGGLE_LOADING = 'TOGGLE_LOADING_GENOMIC_SUGGESTER',
  FAILURE = 'FAILURE_GENOMIC_SUGGESTER',
  RE_INITIALIZE_STATE = 'RE_INITIALIZE_STATE_GENOMIC_SUGGESTER',
  CLEAR_SUGGESTIONS = 'CLEAR_MESSAGE_GENOMIC_SUGGESTER',
  ADD_SUGGESTIONS = 'ADD_SUGGESTIONS_GENOMIC_SUGGESTER',
  SELECT_SUGGESTION = 'SELECT_SUGGESTION_GENOMIC_SUGGESTER',
}

export type SelectedSuggestionAction = {
  type: GenomicActionTypes.SELECT_SUGGESTION;
  selectedSuggestion: SelectedSuggestion;
};

type AddSuggestions = {
  type: GenomicActionTypes.ADD_SUGGESTIONS;
  suggestions: Suggestion[];
  searchText: SearchText;
};

type Failure = {
  type: GenomicActionTypes.FAILURE;
  error: Error | null;
};

type ReInitializeState = {
  type: GenomicActionTypes.RE_INITIALIZE_STATE;
};

type ClearSuggestions = {
  type: GenomicActionTypes.CLEAR_SUGGESTIONS;
};

type ToggleLoading = {
  type: GenomicActionTypes.TOGGLE_LOADING;
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
