import { ThunkAction } from 'redux-thunk';
import {
  FAILURE_CREATE,
  FAILURE_LOAD_SAVE_SETS,
  RE_INITIALIZE_STATE,
  REMOVE_USER_SAVE_SETS,
  SaveSetNameConflictError,
  SaveSetParams,
  SaveSetsActionTypes,
  TOGGLE_IS_DELETING_SAVE_SETS,
  TOGGLE_LOADING_SAVE_SETS,
  TOGGLE_PENDING_CREATE,
  USER_SAVE_SETS,
  UserSaveSets,
} from '../saveSetTypes';
import { deleteSaveSet, getSetAndParticipantsCountByUser, saveSetCountForTag } from 'services/sets';
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

export const getUserSaveSets = (
  userId: string,
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  dispatch(isLoadingSaveSets(true));
  try {
    const userSets = await getSetAndParticipantsCountByUser(userId);
    const payload: UserSaveSets[] = userSets.map((s: { node: UserSaveSets }) => ({
      setId: s.node.setId,
      size: s.node.size,
      tag: s.node.tag,
    }));
    dispatch(displayUserSaveSets(payload));
  } catch (e) {
    dispatch(failureLoadSaveSets(e));
  }
  dispatch(isLoadingSaveSets(false));
};

export const deleteUserSaveSets = (
  userId: string,
  setIds: string[],
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  dispatch(isDeletingSaveSets(true));
  try {
    await deleteSaveSet(userId, setIds);

    dispatch(removeUserSavedSets(setIds));
  } catch (e) {
    //nothing to be done
    console.error(e);
  } finally {
    dispatch(isDeletingSaveSets(false));
  }
};

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

export const isDeletingSaveSets = (isDeleting: boolean): SaveSetsActionTypes => ({
  type: TOGGLE_IS_DELETING_SAVE_SETS,
  isDeleting,
});

export const displayUserSaveSets = (payload: UserSaveSets[]): SaveSetsActionTypes => ({
  type: USER_SAVE_SETS,
  payload,
});

export const failureLoadSaveSets = (error: Error): SaveSetsActionTypes => ({
  type: FAILURE_LOAD_SAVE_SETS,
  error,
});

export const removeUserSavedSets = (sets: string[]): SaveSetsActionTypes => ({
  type: REMOVE_USER_SAVE_SETS,
  sets,
});
