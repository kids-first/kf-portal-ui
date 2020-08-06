import { ThunkAction } from 'redux-thunk';
import {
  FAILURE_CREATE,
  RE_INITIALIZE_STATE,
  SaveSetParams,
  SaveSetsActionTypes,
  TAG_NAME_CONFLICT,
  TOGGLE_PENDING_CREATE,
} from '../saveSetTypes';
import { saveSetCountForTag } from '../../services/sets';
// @ts-ignore
import saveSet from '@kfarranger/components/dist/utils/saveSet';
import { RootState } from '../rootState';
import graphql from '../../services/arranger';

export const createSaveSet = (
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  const { tag, userId, api, sqon, onSuccess, onNameConflict } = payload;

  dispatch(togglePendingCreate(true));
  try {
    const tagIsUnique = (await saveSetCountForTag(tag, userId)) === 0;
    if (tagIsUnique) {
      await saveSet({
        type: 'participant',
        path: 'kf_id',
        sqon,
        userId: userId,
        api: graphql(api),
        tag: tag,
      });
      onSuccess();
    } else {
      onNameConflict();
      dispatch(toggleTagNameExist(true));
    }
  } catch (error) {
    return dispatch(failureFilter(error));
  } finally {
    dispatch(togglePendingCreate(false));
  }
};

export const togglePendingCreate = (isPending: boolean): SaveSetsActionTypes => ({
  type: TOGGLE_PENDING_CREATE,
  isPending,
});

export const failureFilter = (error: Error): SaveSetsActionTypes => ({
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
