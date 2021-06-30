import {
  QueryType,
  SavedQueriesActions,
  SavedQueriesActionTypes,
  SavedQueriesState,
  SavedQueriesStatuses,
} from '../SavedQueriesTypes';

const initialState: SavedQueriesState = {
  isLoadingAllQueries: false,
  queries: { [QueryType.file]: [], [QueryType.cohort]: [] },
  queryIdToStatus: {},
  errorFetchAllQueries: null,
};

export default (state = initialState, action: SavedQueriesActionTypes): SavedQueriesState => {
  switch (action.type) {
    case SavedQueriesActions.toggleFetchAllSavedQueries: {
      return { ...state, isLoadingAllQueries: action.isLoadingAllQueries };
    }
    case SavedQueriesActions.addAllSavedQueries: {
      return { ...state, queries: action.queries };
    }
    case SavedQueriesActions.failureFetchingAllSavedQueries: {
      return { ...state, errorFetchAllQueries: action.error };
    }
    case SavedQueriesActions.requestDeleteSavedQuery: {
      const queryId = action.queryId;

      const queryIdToStatusShallowCopy = { ...state.queryIdToStatus };
      queryIdToStatusShallowCopy[queryId] = SavedQueriesStatuses.deleting;

      return { ...state, queryIdToStatus: queryIdToStatusShallowCopy };
    }
    case SavedQueriesActions.successDeletingSavedQuery: {
      const queryId = action.queryId;
      const queryType = action.queryType;

      const queryIdToStatusShallowCopy = { ...state.queryIdToStatus };
      delete queryIdToStatusShallowCopy[queryId];

      const queriesShallowCopy = { ...state.queries };
      const queriesForTypeShallowCopy = [...queriesShallowCopy[queryType]];
      const filteredQueriesForType = queriesForTypeShallowCopy.filter((q) => q.id !== queryId);
      return {
        ...state,
        queries: { ...queriesShallowCopy, [queryType]: filteredQueriesForType },
        queryIdToStatus: queryIdToStatusShallowCopy,
      };
    }
    case SavedQueriesActions.failureDeletingSavedQuery: {
      const queryId = action.queryId;
      const queryIdToStatusShallowCopy = { ...state.queryIdToStatus };
      queryIdToStatusShallowCopy[queryId] = SavedQueriesStatuses.error;
      return { ...state, queryIdToStatus: queryIdToStatusShallowCopy };
    }
    default:
      return state;
  }
};
