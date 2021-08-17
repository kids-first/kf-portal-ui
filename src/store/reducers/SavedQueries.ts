import omit from 'lodash/omit';

import {
  QueryType,
  SavedQueriesActions,
  SavedQueriesActionTypes,
  SavedQueriesState,
  SavedQueriesStatuses,
  SplitSavedQueries,
} from '../SavedQueriesTypes';
import { LogoutAction, UserActions } from '../userTypes';

const initialState: SavedQueriesState = {
  isLoadingAllQueries: false,
  queries: { [QueryType.file]: [], [QueryType.cohort]: [] },
  queryIdToStatus: {},
  errorFetchAllQueries: null,
};

const removeGivenQueryFromQueries = (
  queryIdToRemove: string,
  queries: SplitSavedQueries,
): SplitSavedQueries => {
  const fileQueries = queries[QueryType.file].filter((q) => q.id !== queryIdToRemove);
  const cohortQueries = queries[QueryType.cohort].filter((q) => q.id !== queryIdToRemove);
  return { [QueryType.file]: fileQueries, [QueryType.cohort]: cohortQueries };
};

export default (
  state = initialState,
  action: SavedQueriesActionTypes | LogoutAction,
): SavedQueriesState => {
  switch (action.type) {
    case SavedQueriesActions.toggleFetchAllSavedQueries: {
      return { ...state, isLoadingAllQueries: action.isLoadingAllQueries };
    }
    case SavedQueriesActions.requestFetchAllSavedQueries: {
      return { ...initialState, isLoadingAllQueries: true };
    }
    case SavedQueriesActions.addAllSavedQueries: {
      return { ...state, queries: action.queries };
    }
    case SavedQueriesActions.failureFetchingAllSavedQueries: {
      return { ...state, errorFetchAllQueries: action.error };
    }
    case SavedQueriesActions.requestDeleteSavedQuery: {
      return {
        ...state,
        queryIdToStatus: {
          ...state.queryIdToStatus,
          [action.queryId]: SavedQueriesStatuses.deleting,
        },
      };
    }
    case SavedQueriesActions.successDeletingSavedQuery: {
      const queryId = action.queryId;
      return {
        ...state,
        queries: removeGivenQueryFromQueries(queryId, state.queries),
        queryIdToStatus: omit(state.queryIdToStatus, [queryId]),
      };
    }
    case SavedQueriesActions.failureDeletingSavedQuery: {
      return {
        ...state,
        queryIdToStatus: {
          ...state.queryIdToStatus,
          [action.queryId]: SavedQueriesStatuses.error,
        },
      };
    }
    case UserActions.logout: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
