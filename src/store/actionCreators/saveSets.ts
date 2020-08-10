import { ThunkAction } from 'redux-thunk';
import {
  FAILURE_CREATE,
  RE_INITIALIZE_STATE,
  SaveSetNameConflictError,
  SaveSetParams,
  SaveSetsActionTypes,
  TOGGLE_LOADING_SAVE_SETS,
  TOGGLE_PENDING_CREATE,
} from '../saveSetTypes';
import { saveSetCountForTag } from 'services/sets';
// @ts-ignore
import saveSet from '@kfarranger/components/dist/utils/saveSet';
import { RootState } from '../rootState';
import graphql from 'services/arranger';

const createSaveSet = (
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  const { tag, userId, api, sqon, onSuccess } = payload;

  dispatch(isLoadingCreateSaveSet(true));

  try {
    await saveSet({
      type: 'participant',
      path: 'kf_id',
      sqon,
      userId: userId,
      api: graphql(api),
      tag: tag,
    });
    if (onSuccess) {
      onSuccess();
    }
  } catch (e) {
    dispatch(failureCreate(e));
  } finally {
    dispatch(isLoadingCreateSaveSet(false));
  }
};

export const createSaveSetIfUnique = (
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  const { tag, userId, onNameConflict } = payload;

  dispatch(isLoadingCreateSaveSet(true));
  try {
    const tagIsUnique = (await saveSetCountForTag(tag, userId)) === 0;

    if (tagIsUnique) {
      dispatch(isLoadingCreateSaveSet(false));
      dispatch(createSaveSet(payload));
      return;
    }

    if (onNameConflict) {
      onNameConflict();
    }

    dispatch(failureCreate(new SaveSetNameConflictError('A set with this name already exists')));
    dispatch(isLoadingCreateSaveSet(false));
  } catch (error) {
    dispatch(failureCreate(error));
    dispatch(isLoadingCreateSaveSet(false));
  }
};

// export const getUserSaveSets = (
//   payload: SaveSetParams,
// ): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
//   const { userId } = payload;
// };

export const isLoadingCreateSaveSet = (isPending: boolean): SaveSetsActionTypes => ({
  type: TOGGLE_PENDING_CREATE,
  isPending,
});

export const failureCreate = (error: Error): SaveSetsActionTypes => ({
  type: FAILURE_CREATE,
  error,
});

export const reInitializeSaveSetsState = (): SaveSetsActionTypes => ({
  type: RE_INITIALIZE_STATE,
});

export const isLoadingSaveSets = (isLoading: boolean): SaveSetsActionTypes => ({
  type: TOGGLE_LOADING_SAVE_SETS,
  isLoading,
});
