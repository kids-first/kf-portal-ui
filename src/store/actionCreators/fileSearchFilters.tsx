import {
  FAILURE,
  FileSearchFiltersActionTypes,
  TOGGLE_LOADING,
  RE_INITIALIZE_STATE,
  SearchConfig,
  EntityName,
} from '../fileSearchFiltersTypes';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../rootState';
import { searchFilesFromKfId, transformIdIntoKfId } from 'services/fileSearchFilters';

export const toggleFilterLoading = (
  isLoading: boolean,
  entityName: EntityName,
): FileSearchFiltersActionTypes => ({
  type: TOGGLE_LOADING,
  isLoading,
  entityName,
});

export const failureFilter = (
  error: Error,
  entityName: EntityName,
): FileSearchFiltersActionTypes => ({
  type: FAILURE,
  error,
  entityName,
});

export const reInitializeFilterState = (entityName: EntityName): FileSearchFiltersActionTypes => ({
  type: RE_INITIALIZE_STATE,
  entityName,
});

export const searchByKfId = (
  payload: SearchConfig,
): ThunkAction<void, RootState, null, FileSearchFiltersActionTypes> => async (dispatch) => {
  const { setArrangerSqonCB, id, entityName } = payload;

  dispatch(toggleFilterLoading(true, entityName));
  try {
    searchFilesFromKfId({ setSqonCB: setArrangerSqonCB, entityName, kfId: id });
  } catch (error) {
    dispatch(failureFilter(error, entityName));
  } finally {
    dispatch(toggleFilterLoading(false, entityName));
  }
};

export const searchById = (
  payload: SearchConfig,
): ThunkAction<void, RootState, null, FileSearchFiltersActionTypes> => async (dispatch) => {
  const { entityName, id, setArrangerSqonCB } = payload;
  dispatch(toggleFilterLoading(true, entityName));
  let kfId;
  try {
    kfId = await transformIdIntoKfId(entityName, id);
  } catch (error) {
    return dispatch(failureFilter(error, entityName));
  } finally {
    dispatch(toggleFilterLoading(false, entityName));
  }

  if (kfId) {
    dispatch(searchByKfId({ setArrangerSqonCB, id: kfId, entityName }));
  } else {
    dispatch(failureFilter(new Error('Input id is unknown'), entityName));
  }
};
