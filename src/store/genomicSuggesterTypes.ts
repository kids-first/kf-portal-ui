import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './rootState';

export const TOGGLE_LOADING = 'TOGGLE_LOADING_GENOMIC_SUGGESTER';
export const FAILURE = 'FAILURE_GENOMIC_SUGGESTER';
export const RE_INITIALIZE_STATE = 'RE_INITIALIZE_STATE_GENOMIC_SUGGESTER';
export const CLEAR_SUGGESTIONS = 'CLEAR_MESSAGE_GENOMIC_SUGGESTER';
export const ADD_SUGGESTIONS = 'ADD_SUGGESTIONS_GENOMIC_SUGGESTER';
export const SELECT_SUGGESTION = 'SELECT_SUGGESTION_GENOMIC_SUGGESTER';

export enum GenomicFeatureType {
  Variant = 'variant',
  GENE = 'gene',
}

export type SearchText = string;

export type SuggestionId = string;

export type Suggestion = {
  locus: string | undefined;
  type: GenomicFeatureType;
  matchedText: string;
  suggestion_id: string;
};

export type SelectedSuggestion = {
  featureType: GenomicFeatureType;
  suggestionId: SuggestionId;
};

export type SelectedSuggestionAction = {
  type: typeof SELECT_SUGGESTION;
  selectedSuggestion: SelectedSuggestion;
};

interface AddSuggestions {
  type: typeof ADD_SUGGESTIONS;
  suggestions: Suggestion[];
  searchText: SearchText;
}

interface Failure {
  type: typeof FAILURE;
  error: Error | null;
}

interface ReInitializeState {
  type: typeof RE_INITIALIZE_STATE;
}

interface ClearSuggestions {
  type: typeof CLEAR_SUGGESTIONS;
}

interface ToggleLoading {
  type: typeof TOGGLE_LOADING;
  isLoading: boolean;
}

export interface GenomicSuggesterState {
  searchText: string | undefined;
  isLoading: boolean;
  error: Error | null | undefined;
  suggestions: Suggestion[];
  selectedSuggestion: SelectedSuggestion | null | undefined;
}

export type GenomicSuggesterTypes =
  | Failure
  | SelectedSuggestionAction
  | ReInitializeState
  | ClearSuggestions
  | ToggleLoading
  | AddSuggestions;

export type DispatchGenomicSuggester = ThunkDispatch<RootState, null, GenomicSuggesterTypes>;
