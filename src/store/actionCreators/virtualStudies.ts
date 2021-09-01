import {
  createNewVirtualStudy,
  deleteVirtualStudy as deleteVirtualStudyApi,
  getVirtualStudies,
  getVirtualStudy,
  updateVirtualStudy,
} from 'services/virtualStudies';
import { Sqon } from 'store/sqon';
import { User } from 'store/userTypes';
import {
  Term,
  ThunkActionVirtualStudies,
  Uid,
  VirtualStudiesActions,
  VirtualStudiesActionTypes,
  VirtualStudy,
  VirtualStudyId,
  VirtualStudyRaw,
} from 'store/virtualStudiesTypes';

import { Api } from '../apiTypes';

const assertStudyId = (id: unknown) => {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(`Study id must be a non-empty string, but got "${id}"`);
  }
};

const assertStudyName = (name: unknown) => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Study name cannot be empty');
  }
};

const assertUser = (user: User) => {
  if (!user) {
    throw new Error('User expected');
  }
  if (!user.egoId) {
    throw new Error('User expected to have a Ego id: "egoId"');
  }
  if (!user._id) {
    throw new Error('User expected to have a Persona id: "_id"');
  }
};

export const fetchVirtualStudiesRequested = (uid: Uid): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_REQUESTED,
  payload: uid,
});

export const fetchVirtualStudiesSuccess = (
  virtualStudies: VirtualStudy[],
): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_SUCCESS,
  payload: virtualStudies,
});

export const fetchVirtualStudiesFailure = (error: Error): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_FAILURE,
  payload: error,
});

export const virtualStudyLoadRequested = (
  virtualStudyId: VirtualStudyId,
): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_LOAD_REQUESTED,
  payload: virtualStudyId,
});

export const virtualStudyLoadSuccess = (virtualStudy: VirtualStudy): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_LOAD_SUCCESS,
  payload: virtualStudy,
});

export const virtualStudyLoadFailure = (error: Error): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_LOAD_FAILURE,
  payload: error.message,
});

export const virtualStudySaveRequested = (study: VirtualStudy): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_SAVE_REQUESTED,
  payload: study,
});

export const virtualStudySaveSuccess = (study: VirtualStudyRaw): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_SAVE_SUCCESS,
  payload: study,
});

export const fetchVirtualStudySuccess = (
  updatedStudies: VirtualStudy[],
): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_SUCCESS,
  payload: updatedStudies,
});

export const virtualStudySaveFailure = (error: Error): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_SAVE_FAILURE,
  payload: error,
});

export const virtualStudyDeleteRequested = (
  virtualStudyId: VirtualStudyId,
): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_DELETE_REQUESTED,
  payload: virtualStudyId,
});

export const virtualStudyDeleteSuccess = (
  virtualStudyId: VirtualStudyId,
): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_DELETE_SUCCESS,
  payload: virtualStudyId,
});

export const virtualStudyDeleteFailure = (error: Error): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_DELETE_FAILURE,
  payload: error,
});

export const resetVirtualStudy = (): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_RESET,
  payload: null,
});

export const setActiveSqonIndex = (activeIndex: number): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.SET_ACTIVE_INDEX,
  payload: activeIndex,
});

export const setSqons = (sqons: Sqon | Sqon[]): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.SET_SQONS,
  payload: sqons,
});

export const setSelectionSqons = (sqons: Sqon | Sqon[] | null): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.SET_SELECTION_SQONS,
  payload: sqons,
});

export const setVirtualStudyId = (virtualStudyId: VirtualStudyId): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.SET_VIRTUAL_STUDY_ID,
  payload: virtualStudyId,
});

export const cleanError = (): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.VIRTUAL_STUDY_CLEAN_ERROR,
});

export const addTermToActiveIndexAction = (payload: {
  term: Term;
  sqonOp?: string;
}): VirtualStudiesActionTypes => ({
  type: VirtualStudiesActions.ADD_TERM_TO_CURRENT_VIRTUAL_STUDY,
  payload,
});

export const fetchVirtualStudiesCollection = (api: Api, uid: Uid): ThunkActionVirtualStudies => (
  dispatch,
): Promise<void> => {
  dispatch(fetchVirtualStudiesRequested(uid));

  return getVirtualStudies(api, uid)
    .then((virtualStudies) => {
      dispatch(fetchVirtualStudiesSuccess(virtualStudies));
    })
    .catch((err) => {
      dispatch(fetchVirtualStudiesFailure(err));
      console.error(`Error fetching virtual studies collection for uid "${uid}"`, err.message);
    });
};

export const loadSavedVirtualStudy = (
  api: Api,
  virtualStudyId: VirtualStudyId,
): ThunkActionVirtualStudies => (dispatch) => {
  dispatch(virtualStudyLoadRequested(virtualStudyId));
  return getVirtualStudy(api)(virtualStudyId)
    .then((virtualStudy: VirtualStudy) => dispatch(virtualStudyLoadSuccess(virtualStudy)))
    .catch((err: Error) => {
      dispatch(virtualStudyLoadFailure(err));
      console.error(err.message);
    });
};

export const saveVirtualStudy = (
  api: Api,
  user: User,
  study: VirtualStudy,
): ThunkActionVirtualStudies => (dispatch) => {
  try {
    assertStudyName(study.name);
    assertUser(user);
  } catch (err) {
    return Promise.reject(err);
  }

  dispatch(virtualStudySaveRequested(study));

  const saveDelegate = study.virtualStudyId ? updateVirtualStudy : createNewVirtualStudy;
  return saveDelegate(api, user, study)
    .then(([newStudy, updatedStudies]) => {
      dispatch(
        virtualStudySaveSuccess({
          virtualStudyId: newStudy.virtualStudyId,
          uid: newStudy.uid,
          name: newStudy.name,
          description: newStudy.description,
        }),
      );
      dispatch(fetchVirtualStudySuccess(updatedStudies));
    })
    .catch((err) => {
      dispatch(virtualStudySaveFailure(err));
    });
};

export const deleteVirtualStudy = ({
  api,
  virtualStudyId,
  user,
}: {
  api: Api;
  virtualStudyId: VirtualStudyId;
  user: User;
}): ThunkActionVirtualStudies => async (dispatch) => {
  assertStudyId(virtualStudyId);
  assertUser(user);

  dispatch(virtualStudyDeleteRequested(virtualStudyId));

  return deleteVirtualStudyApi({ virtualStudyId, api, user })
    .then(() => dispatch(fetchVirtualStudiesCollection(api, user.egoId)))
    .then(() => {
      dispatch(virtualStudyDeleteSuccess(virtualStudyId));
    })
    .catch((err) => {
      dispatch(virtualStudyDeleteFailure(err));
    });
};

export const addTermToActiveIndex = (term: Term, sqonOp?: string): ThunkActionVirtualStudies => (
  dispatch,
) => {
  dispatch(
    addTermToActiveIndexAction({
      term: term,
      sqonOp,
    }),
  );
};

export const createQueryInCohortBuilder = (sqons: Sqon[]): ThunkActionVirtualStudies => async (
  dispatch,
) => {
  dispatch(setSqons(sqons));
  dispatch(setActiveSqonIndex(sqons.length - 1));
};
