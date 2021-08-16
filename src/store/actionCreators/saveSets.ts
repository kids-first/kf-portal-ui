import { ThunkAction } from 'redux-thunk';

import {
  createSet as saveSet,
  deleteSets,
  getSetAndParticipantsCountByUser,
  setCountForTag,
  updateSet,
} from 'services/sets';

import { RootState } from '../rootState';
import {
  AddRemoveSetParams,
  DeleteSetParams,
  EditSetTagParams,
  SaveSetParams,
  SetInfo,
  SetNameConflictError,
  SetsActions,
  SetsActionTypes,
  SetSourceType,
  SetSubActionTypes,
  SetUpdateInputData,
  UserSet,
} from '../saveSetTypes';
import { selectSets } from '../selectors/saveSetsSelectors';

export const createSet = (
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (
  dispatch,
  getState: () => RootState,
) => {
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
      dispatch(failureCreate(new Error(response.errors[0].message)));
      return;
    }

    const createdSet: UserSet = response.data.saveSet;
    dispatch(displayUserSets([...selectSets(getState()), createdSet]));

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
      const { updatedResults } = await updateSet(
        SetSourceType.SAVE_SET,
        data,
        SetSubActionTypes.RENAME_TAG,
        setInfo.key,
      );

      if (updatedResults && updatedResults > 0) {
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
    const payload: UserSet[] = userSets.map((s: { node: UserSet }) => ({
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

export const fetchSetsIfNeeded = (
  userId: string,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch, getState) => {
  const setsInStore = selectSets(getState());
  if (setsInStore.length === 0) {
    dispatch(getUserSets(userId));
  }
};

export const addRemoveSetIds = (
  payload: AddRemoveSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (
  dispatch,
  getState: () => RootState,
) => {
  const { onSuccess, onFail, sqon, path, type, subActionType, setId } = payload;

  dispatch(isAddingOrRemovingToSet(true));

  const data: SetUpdateInputData = {
    sqon,
    path,
    type,
  };

  try {
    const response = await updateSet(SetSourceType.QUERY, data, subActionType, setId);

    if (!response) {
      return onFail();
    }

    const { setSize, updatedResults } = response;

    if (updatedResults && updatedResults > 0) {
      const sets: UserSet[] = selectSets(getState());
      const setsWithUpdatedCount = sets.map((s) => {
        if (s.setId === setId) {
          return { setId: s.setId, size: setSize, tag: s.tag };
        } else {
          return s;
        }
      });

      dispatch(displayUserSets(setsWithUpdatedCount));

      onSuccess();
    } else {
      onFail();
    }
  } catch (e) {
    console.error(e);
    onFail();
  } finally {
    dispatch(isAddingOrRemovingToSet(false));
  }
};

export const deleteUserSets = (
  payload: DeleteSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  const { setIds, onFail } = payload;

  dispatch(isDeletingSets(true));

  try {
    const result = await deleteSets(setIds);

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

export const createSetQueryInCohortBuilder = (
  setId: string,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  dispatch(requestCreateQueryInCohort(setId));
};

export const isLoadingCreateSet = (isPending: boolean): SetsActionTypes => ({
  type: SetsActions.TOGGLE_PENDING_CREATE,
  isPending,
});

export const failureCreate = (error: Error): SetsActionTypes => ({
  type: SetsActions.FAILURE_CREATE,
  error,
});

export const reInitializeSetsState = (): SetsActionTypes => ({
  type: SetsActions.RE_INITIALIZE_STATE,
});

export const isLoadingSets = (isLoading: boolean): SetsActionTypes => ({
  type: SetsActions.TOGGLE_LOADING_SAVE_SETS,
  isLoading,
});

export const isDeletingSets = (isDeleting: boolean): SetsActionTypes => ({
  type: SetsActions.TOGGLE_IS_DELETING_SAVE_SETS,
  isDeleting,
});

export const isAddingOrRemovingToSet = (isEditing: boolean): SetsActionTypes => ({
  type: SetsActions.TOGGLE_IS_ADD_DELETE_TO_SET,
  isEditing,
});

export const displayUserSets = (payload: UserSet[]): SetsActionTypes => ({
  type: SetsActions.USER_SAVE_SETS,
  payload,
});

export const failureLoadSets = (error: Error): SetsActionTypes => ({
  type: SetsActions.FAILURE_LOAD_SAVE_SETS,
  error,
});

export const removeUserSets = (sets: string[]): SetsActionTypes => ({
  type: SetsActions.REMOVE_USER_SAVE_SETS,
  sets,
});

export const isEditingTag = (set: SetInfo): SetsActionTypes => ({
  type: SetsActions.EDIT_SAVE_SET_TAG,
  set: set,
});

export const requestCreateQueryInCohort = (setId: string): SetsActionTypes => ({
  type: SetsActions.CREATE_SET_QUERY_REQUEST,
  setId,
});

export const addSetToCurrentQuery = (setId: string): SetsActionTypes => ({
  type: SetsActions.ADD_SET_TO_CURRENT_QUERY,
  setId,
});
