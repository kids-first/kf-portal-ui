import { ThunkDispatch } from 'redux-thunk';

import { RootState } from './rootState';
import { VirtualStudy } from './virtualStudiesTypes';

type FilesQueryContent = {
  Families: number;
  Files: number;
  Participants: number;
  Size: string;
  longUrl: string;
  'og:description': string;
  'og:image': string;
  'og:title': string;
  'twitter:data1': string;
  'twitter:label1': string;
};

export type SavedQueryWithFileContent = {
  alias: string;
  content: FilesQueryContent;
  creationDate: string;
  updatedDate: string;
  sharedPublicly: boolean;
  uid: string;
  id: string;
};

export enum QueryType {
  //riff
  file = 'file',
  //persona
  cohort = 'cohort',
}

export type VirtualStudyPlusId = VirtualStudy & { id: string };

export type SplitSavedQueries = {
  [QueryType.file]: Array<SavedQueryWithFileContent>;
  [QueryType.cohort]: Array<VirtualStudyPlusId>;
};

export enum SavedQueriesActions {
  fetchAllSavedQueries = 'fetchAllSavedQueries',
  requestDeleteSavedQuery = 'requestDeleteSavedQuery',
  successDeletingSavedQuery = 'successDeletingSavedQuery',
  toggleFetchAllSavedQueries = 'toggleFetchAllSavedQueries',
  failureFetchingAllSavedQueries = 'failureFetchingAllSavedQueries',
  failureDeletingSavedQuery = 'failureDeletingSavedQuery',
  addAllSavedQueries = 'addAllSavedQueries',
}

type AddSavedQueriesAction = {
  type: SavedQueriesActions.addAllSavedQueries;
  queries: SplitSavedQueries;
};

type FailureFetchingAllSavedQueriesAction = {
  type: SavedQueriesActions.failureFetchingAllSavedQueries;
  error: Error | null;
};

type FailureDeletingSavedQueryAction = {
  type: SavedQueriesActions.failureDeletingSavedQuery;
  error: Error | null;
  queryId: string;
};

type ToggleLoadingAllSavedQueriesAction = {
  type: SavedQueriesActions.toggleFetchAllSavedQueries;
  isLoadingAllQueries: boolean;
};

type FetchAllSavedQueriesAction = {
  type: SavedQueriesActions.fetchAllSavedQueries;
};

type RequestDeleteSavedQueryAction = {
  type: SavedQueriesActions.requestDeleteSavedQuery;
  queryId: string;
};

type SuccessDeletingSavedQueryAction = {
  type: SavedQueriesActions.successDeletingSavedQuery;
  queryId: string;
  queryType: QueryType;
};

export enum SavedQueriesStatuses {
  deleting = 'deleting',
  error = 'error',
}

export type SavedQueriesState = {
  queries: SplitSavedQueries;
  isLoadingAllQueries: boolean;
  errorFetchAllQueries: Error | null;
  queryIdToStatus: Record<string, SavedQueriesStatuses>;
};

export type SavedQueriesActionTypes =
  | FetchAllSavedQueriesAction
  | RequestDeleteSavedQueryAction
  | ToggleLoadingAllSavedQueriesAction
  | FailureFetchingAllSavedQueriesAction
  | FailureDeletingSavedQueryAction
  | AddSavedQueriesAction
  | SuccessDeletingSavedQueryAction;

export type DispatchSavedQueries = ThunkDispatch<RootState, null, SavedQueriesActionTypes>;
