import { ThunkAction } from 'redux-thunk';

import {
  createSet as saveSet,
  deleteSets,
  getSetAndParticipantsCountByUser,
  updateSet,
} from 'services/sets';
import { ApiConfig } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import {
  AddRemoveSetParams,
  ArrangerUserSet,
  DeleteSetParams,
  EditSetTagParams,
  SaveSetParams,
  SetNameConflictError,
  SetsActions,
  SetsActionTypes,
  SetSourceType,
  SetSubActionTypes,
  SetUpdateInputData,
  UserSet,
} from 'store/saveSetTypes';
import { selectSets } from 'store/selectors/saveSetsSelectors';

const isTagUnique = (getState: () => RootState, tag: string): boolean =>
  selectSets(getState()).filter((s) => s.tag === tag).length === 0;

const createSet = (
  api: (config: ApiConfig) => Promise<ArrangerUserSet>,
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (
  dispatch,
  getState: () => RootState,
) => {
  const { tag, sqon, onSuccess } = payload;

  dispatch(isLoadingCreateSet(true));
  try {
    const createdSet: ArrangerUserSet = await saveSet(api, {
      type: 'participant',
      path: 'kf_id',
      sqon,
      tag,
    });

    const userSet: UserSet = {
      setId: createdSet.id,
      size: createdSet.size,
      tag: createdSet.tag,
    };

    dispatch(displayUserSets([...selectSets(getState()), userSet]));

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
  api: (config: ApiConfig) => Promise<ArrangerUserSet>,
  payload: SaveSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (
  dispatch,
  getState: () => RootState,
) => {
  const { tag, onNameConflict } = payload;

  try {
    const tagIsUnique = isTagUnique(getState, tag);

    if (tagIsUnique) {
      dispatch(createSet(api, payload));
      return;
    }

    if (onNameConflict) {
      onNameConflict();
    }

    dispatch(failureCreate(new SetNameConflictError('A set with this name already exists')));
  } catch (error) {
    dispatch(failureCreate(error));
  }
};

export const editSetTag = (
  api: (config: ApiConfig) => Promise<ArrangerUserSet>,
  payload: EditSetTagParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (
  dispatch,
  getState: () => RootState,
) => {
  const { setId, newTag, onNameConflict, onSuccess, onFail } = payload;

  try {
    const tagIsUnique = isTagUnique(getState, newTag);
    if (tagIsUnique) {
      const data: SetUpdateInputData = {
        newTag,
      };
      const result: ArrangerUserSet = await updateSet(
        api,
        SetSourceType.SAVE_SET,
        data,
        SetSubActionTypes.RENAME_TAG,
        setId,
      );

      dispatch(isEditingTag(result.id, result.tag));
      onSuccess();
      return;
    }

    if (onNameConflict) {
      onNameConflict();
    }

    dispatch(failureCreate(new SetNameConflictError('A set with this name already exists')));
  } catch (error) {
    console.error(error);
    onFail();
  }
};

export const getUserSets = (
  api: (config: ApiConfig) => Promise<ArrangerUserSet[]>,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  dispatch(isLoadingSets(true));
  try {
    const userSets: ArrangerUserSet[] = await getSetAndParticipantsCountByUser(api);
    const payload: UserSet[] = userSets.map((s) => ({
      setId: s.id,
      size: s.size,
      tag: s.tag,
    }));
    dispatch(displayUserSets(payload));
  } catch (e) {
    dispatch(failureLoadSets(e));
  }
  dispatch(isLoadingSets(false));
};

export const fetchSetsIfNeeded = (
  api: (config: ApiConfig) => Promise<ArrangerUserSet[]>,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch, getState) => {
  const setsInStore = selectSets(getState());
  if (setsInStore.length === 0) {
    dispatch(getUserSets(api));
  }
};

export const addRemoveSetIds = (
  api: (config: ApiConfig) => Promise<ArrangerUserSet>,
  payload: AddRemoveSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (
  dispatch,
  getState: () => RootState,
) => {
  const { onSuccess, onFail, sqon, subActionType, setId } = payload;

  dispatch(isAddingOrRemovingToSet(true));

  const data: SetUpdateInputData = {
    sqon,
  };

  try {
    const userSet: ArrangerUserSet = await updateSet(
      api,
      SetSourceType.QUERY,
      data,
      subActionType,
      setId,
    );

    const sets: UserSet[] = selectSets(getState());
    const setsWithUpdatedCount = sets.map((s) => {
      if (s.setId === setId) {
        return { setId: s.setId, size: userSet.size, tag: s.tag };
      } else {
        return s;
      }
    });

    dispatch(displayUserSets(setsWithUpdatedCount));

    onSuccess();
  } catch (e) {
    console.error(e);
    onFail();
  } finally {
    dispatch(isAddingOrRemovingToSet(false));
  }
};

export const deleteUserSets = (
  api: (config: ApiConfig) => Promise<boolean>,
  payload: DeleteSetParams,
): ThunkAction<void, RootState, null, SetsActionTypes> => async (dispatch) => {
  const { setId, onFail } = payload;

  dispatch(isDeletingSets(true));

  try {
    const result = await deleteSets(api, setId);

    if (result) {
      dispatch(removeUserSets(setId));
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

export const removeUserSets = (setId: string): SetsActionTypes => ({
  type: SetsActions.REMOVE_USER_SAVE_SET,
  setId,
});

export const isEditingTag = (setId: string, tag: string): SetsActionTypes => ({
  type: SetsActions.EDIT_SAVE_SET_TAG,
  setId,
  tag,
});

export const requestCreateQueryInCohort = (setId: string): SetsActionTypes => ({
  type: SetsActions.CREATE_SET_QUERY_REQUEST,
  setId,
});

export const addSetToCurrentQuery = (setId: string): SetsActionTypes => ({
  type: SetsActions.ADD_SET_TO_CURRENT_QUERY,
  setId,
});
