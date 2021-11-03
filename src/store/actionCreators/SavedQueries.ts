import chunk from 'lodash/chunk';
import { ThunkAction } from 'redux-thunk';

import { deleteSavedQuery, fetchAllSavedQueries } from 'services/riffQueries';
import { getVirtualStudies } from 'services/virtualStudies';

import { Api } from '../apiTypes';
import { RootState } from '../rootState';
import {
  QueryType,
  SavedQueriesActions,
  SavedQueriesActionTypes,
  SavedQueryWithFileContent,
  SplitSavedQueries,
} from '../SavedQueriesTypes';
import { User } from '../userTypes';

import { deleteVirtualStudy } from './virtualStudies';

const toggleFetchAllQueriesLoading = (isLoadingAllQueries: boolean): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.toggleFetchAllSavedQueries,
  isLoadingAllQueries,
});

const addSavedQueries = (queries: SplitSavedQueries): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.addAllSavedQueries,
  queries,
});

const failureFetchingAllSavedQueries = (error: Error): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.failureFetchingAllSavedQueries,
  error,
});

const requestDeleteSavedQueryAction = (queryId: string): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.requestDeleteSavedQuery,
  queryId,
});

const successDeletingSavedQueryAction = (queryId: string): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.successDeletingSavedQuery,
  queryId,
});

const failureDeletingSavedQuery = (queryId: string, error: Error): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.failureDeletingSavedQuery,
  queryId,
  error,
});

const requestFetchAllSavedQueries = (): SavedQueriesActionTypes => ({
  type: SavedQueriesActions.requestFetchAllSavedQueries,
});

export const deleteParticularSavedQuery = (
  api: Api,
  queryId: string,
  user: User,
  queryType: QueryType,
): ThunkAction<void, RootState, null, SavedQueriesActionTypes> => async (dispatch) => {
  dispatch(requestDeleteSavedQueryAction(queryId));
  try {
    if (queryType === QueryType.cohort) {
      dispatch(deleteVirtualStudy({ api, virtualStudyId: queryId, user }));
    }
    await deleteSavedQuery(api, queryId);
    dispatch(successDeletingSavedQueryAction(queryId));
  } catch (error) {
    console.error(error);
    dispatch(failureDeletingSavedQuery(queryId, error));
  }
};

export const fetchSavedQueries = (
  api: Api,
  user: User,
): ThunkAction<void, RootState, null, SavedQueriesActionTypes> => async (dispatch) => {
  dispatch(requestFetchAllSavedQueries());
  try {
    const queriesFromRiff = await fetchAllSavedQueries(api, user);
    const queriesVirtualStudies = await getVirtualStudies(api, user.egoId);
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
    dispatch(addSavedQueries({ [QueryType.cohort]: cohortQueries, [QueryType.file]: fileQueries }));
  } catch (e) {
    console.error(e);
    dispatch(failureFetchingAllSavedQueries(e));
  } finally {
    dispatch(toggleFetchAllQueriesLoading(false));
  }
};

export const deleteAllSaveQueriesFromRiffForUser = (
  api: Api,
  user: User,
): ThunkAction<void, RootState, null, SavedQueriesActionTypes> => async () => {
  const BATCH_SIZE = 10;
  try {
    const queriesFromRiffToDelete = (await fetchAllSavedQueries(
      api,
      user,
    )) as SavedQueryWithFileContent[];
    const chunksOfQueriesToDelete = chunk(queriesFromRiffToDelete, BATCH_SIZE);
    for (const chunkOfQueries of chunksOfQueriesToDelete) {
      await Promise.all(chunkOfQueries.map((query) => deleteSavedQuery(api, query.id)));
    }
  } catch (e) {
    console.error(e);
  }
};
