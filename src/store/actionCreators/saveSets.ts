import { ThunkAction } from 'redux-thunk';
import {
  FAILURE_CREATE,
  RE_INITIALIZE_STATE,
  SaveSetParams,
  SaveSetsActionTypes,
  TAG_NAME_CONFLICT,
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

  dispatch(togglePendingCreate(true));

  try {
    await saveSet({
      type: 'participant',
      path: 'kf_id',
      sqon,
      userId: userId,
      api: graphql(api),
      tag: tag,
    });
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess();
    }
  } catch (e) {
    dispatch(failureCreate(e));
  } finally {
    dispatch(togglePendingCreate(false));
  }
};

export const createSaveSetIfUnique = (
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  const { tag, userId, onNameConflict } = payload;

  dispatch(togglePendingCreate(true));
  try {
    const tagIsUnique = (await saveSetCountForTag(tag, userId)) === 0;

    if (tagIsUnique) {
      dispatch(togglePendingCreate(false));
      dispatch(createSaveSet(payload));
      return;
    }

    if (onNameConflict) {
      onNameConflict();
    }

    dispatch(toggleTagNameExist(true));
    dispatch(togglePendingCreate(false));
  } catch (error) {
    dispatch(failureCreate(error));
    dispatch(togglePendingCreate(false));
  }
};

export const togglePendingCreate = (isPending: boolean): SaveSetsActionTypes => ({
  type: TOGGLE_PENDING_CREATE,
  isPending,
});

export const failureCreate = (error: Error): SaveSetsActionTypes => ({
  type: FAILURE_CREATE,
  error,
});

export const toggleTagNameExist = (hasSameTagName: boolean): SaveSetsActionTypes => ({
  type: TAG_NAME_CONFLICT,
  hasSameTagName,
});

export const reInitializeSaveSetsState = (): SaveSetsActionTypes => ({
  type: RE_INITIALIZE_STATE,
});
