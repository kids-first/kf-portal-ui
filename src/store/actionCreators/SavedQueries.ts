import { ThunkAction } from 'redux-thunk';

import { deleteSavedQuery, fetchAllSavedQueries } from 'services/riffQueries';
import { getVirtualStudies } from 'services/virtualStudies';

import { Api } from '../apiTypes';
import { RootState } from '../rootState';
import {
  QueryType,
  SavedQueriesActions,
  SavedQueriesActionTypes,
  SplitSavedQueries,
} from '../SavedQueriesTypes';
import { LoggedInUser } from '../userTypes';

import { deleteVirtualStudy } from './virtualStudies';

const toggleFetchAllQueriesLoading = (isLoadingAllQueries: boolean): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.toggleFetchAllSavedQueries,
  isLoadingAllQueries,
});

const addQueries = (queries: SplitSavedQueries): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.addAllSavedQueries,
  queries,
});

const failureFetchingAllSavedQueries = (error: Error | null): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.failureFetchingAllSavedQueries,
  error,
});

const requestDeleteSavedQueryAction = (queryId: string): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.requestDeleteSavedQuery,
  queryId,
});

const successDeletingSavedQueryAction = (
  queryId: string,
  queryType: QueryType,
): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.successDeletingSavedQuery,
  queryId,
  queryType,
});

const failureDeletingQuery = (queryId: string, error: Error | null): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.failureDeletingSavedQuery,
  queryId,
  error,
});

export const deleteParticularSavedQuery = (
  api: Api,
  queryId: string,
  loggedInUser: LoggedInUser,
  queryType: QueryType,
): ThunkAction<void, RootState, null, SavedQueriesActionTypes> => async (dispatch) => {
  dispatch(requestDeleteSavedQueryAction(queryId));
  try {
    if (queryType === QueryType.cohort) {
      dispatch(deleteVirtualStudy({ virtualStudyId: queryId, loggedInUser }));
    }
    await deleteSavedQuery(api, queryId);
    dispatch(successDeletingSavedQueryAction(queryId, queryType));
  } catch (error) {
    console.error(error);
    dispatch(failureDeletingQuery(queryId, error));
  }
};

export const fetchSavedQueries = (
  api: Api,
  loggedInUser: LoggedInUser,
): ThunkAction<void, RootState, null, SavedQueriesActionTypes> => async (dispatch) => {
  dispatch(toggleFetchAllQueriesLoading(true));
  try {
    const queriesFromRiff = await fetchAllSavedQueries(api, loggedInUser);
    const queriesVirtualStudies = await getVirtualStudies(api, loggedInUser.egoId);
    /*
     * Refactor of legacy code that had this message:
     * ###
     *  The following filter is a stop-gap solution until Riff supports
     *  tags for server-side differentiation between entity types
     * ###
     * */
    const fileQueries = Array.isArray(queriesFromRiff)
      ? queriesFromRiff.filter((q) => q.alias && !q.content.example && !!q.content.Files)
      : [];
    const cohortQueries = Array.isArray(queriesVirtualStudies)
      ? queriesVirtualStudies.map((vs) => ({ ...vs, id: vs.virtualStudyId }))
      : [];
    dispatch(addQueries({ [QueryType.cohort]: cohortQueries, [QueryType.file]: fileQueries }));
  } catch (e) {
    console.error(e);
    dispatch(failureFetchingAllSavedQueries(e));
  } finally {
    dispatch(toggleFetchAllQueriesLoading(false));
  }
};
