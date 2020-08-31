import { ThunkAction } from 'redux-thunk';
import {
  DeleteSetParams,
  EDIT_SAVE_SET_TAG,
  EditSetParams,
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
import {
  deleteSaveSet,
  editSaveSetTag,
  getSetAndParticipantsCountByUser,
  saveSetCountForTag,
} from 'services/sets';
// @ts-ignore
import saveSet from '@kfarranger/components/dist/utils/saveSet';
import { RootState } from '../rootState';
import graphql from 'services/arranger';
import { initializeApi } from 'services/api';
import { SaveSetInfo } from '../../components/UserDashboard/ParticipantSets';

export const createSaveSet = (
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  const { tag, userId, sqon, onSuccess } = payload;

  dispatch(isLoadingCreateSaveSet(true));

  try {
    await saveSet({
      type: 'participant',
      path: 'kf_id',
      sqon,
      userId: userId,
      api: graphql(initializeApi()),
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

export const editSaveSet = (
  payload: EditSetParams,
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  const { saveSetInfo, onNameConflict, onSuccess, onFail } = payload;

  try {
    const tagIsUnique = (await saveSetCountForTag(saveSetInfo.name, saveSetInfo.currentUser)) === 0;
    if (tagIsUnique) {
      const result = await editSaveSetTag(saveSetInfo);

      if (result && result > 0) {
        dispatch(isEditingTag(saveSetInfo));
        onSuccess();
        return;
      } else {
        onFail();
        return;
      }
    }

    if (onNameConflict) {
      onNameConflict();
    }

    dispatch(failureCreate(new SaveSetNameConflictError('A set with this name already exists')));
  } catch (error) {
    console.error(error);
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
  payload: DeleteSetParams,
): ThunkAction<void, RootState, null, SaveSetsActionTypes> => async (dispatch) => {
  const { userId, setIds, onFail } = payload;

  dispatch(isDeletingSaveSets(true));

  try {
    const result = await deleteSaveSet(userId, setIds);

    if (result && result > 0) dispatch(removeUserSavedSets(setIds));
    else onFail();
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

export const isEditingTag = (set: SaveSetInfo): SaveSetsActionTypes => ({
  type: EDIT_SAVE_SET_TAG,
  set: set,
});
