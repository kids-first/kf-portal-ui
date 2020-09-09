import { ThunkAction } from 'redux-thunk';
import {
  DeleteSetParams,
  EDIT_SAVE_SET_TAG,
  EditSetTagParams,
  FAILURE_CREATE,
  FAILURE_LOAD_SAVE_SETS,
  RE_INITIALIZE_STATE,
  REMOVE_USER_SAVE_SETS,
  SaveSetParams,
  SetNameConflictError,
  SetsActionTypes,
  SetSourceType,
  SetSubActionTypes,
  SetUpdateInputData,
  TOGGLE_IS_ADD_DELETE_TO_SET,
  TOGGLE_IS_DELETING_SAVE_SETS,
  TOGGLE_LOADING_SAVE_SETS,
  TOGGLE_PENDING_CREATE,
  USER_SAVE_SETS,
  UserSaveSets,
} from '../saveSetTypes';
import {
  createSet as saveSet,
  deleteSets,
  getSetAndParticipantsCountByUser,
  setCountForTag,
  updateSet,
} from 'services/sets';
import { RootState } from '../rootState';
import { SetInfo } from 'components/UserDashboard/ParticipantSets';
import { AddRemoveSetParams } from 'components/CohortBuilder/ParticipantsTableView/AddRemoveSaveSetModal';

export const createSet = (
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  const { tag, userId, sqon, onSuccess } = payload;

  dispatch(isLoadingCreateSet(true));

  try {
    const response = await saveSet(userId, {
      type: 'participant',
      path: 'kf_id',
      sqon,
      tag,
    });
    if (response.errors && response.errors.length > 0) {
      dispatch(failureCreate(new Error('Cannot create Set')));
      return;
    }

    if (onSuccess) {
      onSuccess();
    }
  } catch (e) {
    dispatch(failureCreate(e));
  } finally {
    dispatch(isLoadingCreateSet(false));
  }
};

export const createSetIfUnique = (
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  const { tag, userId, onNameConflict } = payload;

  dispatch(isLoadingCreateSet(true));
  try {
    const tagIsUnique = (await setCountForTag(tag, userId)) === 0;

    if (tagIsUnique) {
      dispatch(isLoadingCreateSet(false));
      dispatch(createSet(payload));
      return;
    }
    if (onNameConflict) {
      onNameConflict();
    }

    dispatch(failureCreate(new SetNameConflictError('A set with this name already exists')));
    dispatch(isLoadingCreateSet(false));
  } catch (error) {
    dispatch(failureCreate(error));
    dispatch(isLoadingCreateSet(false));
  }
};

export const editSetTag = (
  payload: EditSetTagParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  const { setInfo, onNameConflict, onSuccess, onFail } = payload;

  try {
    const tagIsUnique = (await setCountForTag(setInfo.name, setInfo.currentUser)) === 0;
    if (tagIsUnique) {
      const data: SetUpdateInputData = {
        newTag: setInfo.name,
      };
      const nOfSaveSetEdited = await updateSet(
        SetSourceType.SAVE_SET,
        data,
        SetSubActionTypes.RENAME_TAG,
        setInfo.currentUser,
        setInfo.setId,
      );

      if (nOfSaveSetEdited && nOfSaveSetEdited > 0) {
        dispatch(isEditingTag(setInfo));
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

    dispatch(failureCreate(new SetNameConflictError('A set with this name already exists')));
  } catch (error) {
    console.error(error);
  }
};

export const getUserSets = (
  userId: string,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  dispatch(isLoadingSets(true));
  try {
    const userSets = await getSetAndParticipantsCountByUser(userId);
    const payload: UserSaveSets[] = userSets.map((s: { node: UserSaveSets }) => ({
      setId: s.node.setId,
      size: s.node.size,
      tag: s.node.tag,
    }));
    dispatch(displayUserSets(payload));
  } catch (e) {
    dispatch(failureLoadSets(e));
  }
  dispatch(isLoadingSets(false));
};

export const addRemoveSetIds = (
  payload: AddRemoveSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  const { onSuccess, onFail, sqon, path, type, subActionType, userId, setId } = payload;

  dispatch(isAddingOrRemovingToSet(true));

  const data: SetUpdateInputData = {
    sqon,
    path,
    type,
  };

  try {
    const nOfSaveSetEdited = await updateSet(
      SetSourceType.QUERY,
      data,
      subActionType,
      userId,
      setId,
    );

    if (nOfSaveSetEdited && nOfSaveSetEdited > 0) {
      // dispatch(isEditingTag(setInfo));
      onSuccess();
      return;
    } else {
      onFail();
      return;
    }
  } catch (e) {
    console.error(e.message);
  }
  dispatch(isAddingOrRemovingToSet(false));
};

export const deleteUserSets = (
  payload: DeleteSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  const { userId, setIds, onFail } = payload;

  dispatch(isDeletingSets(true));

  try {
    const result = await deleteSets(userId, setIds);

    if (result && result > 0) {
      dispatch(removeUserSets(setIds));
    } else {
      onFail();
    }
  } catch (e) {
    //nothing to be done
    console.error(e);
  } finally {
    dispatch(isDeletingSets(false));
  }
};

export const isLoadingCreateSet = (isPending: boolean): SetsActionTypes => ({
  type: TOGGLE_PENDING_CREATE,
  isPending,
});

export const failureCreate = (error: Error): SetsActionTypes => ({
  type: FAILURE_CREATE,
  error,
});

export const reInitializeSetsState = (): SetsActionTypes => ({
  type: RE_INITIALIZE_STATE,
});

export const isLoadingSets = (isLoading: boolean): SetsActionTypes => ({
  type: TOGGLE_LOADING_SAVE_SETS,
  isLoading,
});

export const isDeletingSets = (isDeleting: boolean): SetsActionTypes => ({
  type: TOGGLE_IS_DELETING_SAVE_SETS,
  isDeleting,
});

export const isAddingOrRemovingToSet = (isEditing: boolean): SetsActionTypes => ({
  type: TOGGLE_IS_ADD_DELETE_TO_SET,
  isEditing,
});

export const displayUserSets = (payload: UserSaveSets[]): SetsActionTypes => ({
  type: USER_SAVE_SETS,
  payload,
});

export const failureLoadSets = (error: Error): SetsActionTypes => ({
  type: FAILURE_LOAD_SAVE_SETS,
  error,
});

export const removeUserSets = (sets: string[]): SetsActionTypes => ({
  type: REMOVE_USER_SAVE_SETS,
  sets,
});

export const isEditingTag = (set: SetInfo): SetsActionTypes => ({
  type: EDIT_SAVE_SET_TAG,
  set: set,
});
