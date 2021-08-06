import { apiInitialized } from 'services/api';
import {
  createNewVirtualStudy,
  deleteVirtualStudy as deleteVirtualStudyApi,
  getVirtualStudies,
  getVirtualStudy,
  updateVirtualStudy,
} from 'services/virtualStudies';

import {
  ADD_TERM_TO_CURRENT_VIRTUAL_STUDY,
  FETCH_VIRTUAL_STUDIES_FAILURE,
  FETCH_VIRTUAL_STUDIES_REQUESTED,
  FETCH_VIRTUAL_STUDIES_SUCCESS,
  SET_ACTIVE_INDEX,
  SET_SQONS,
  SET_VIRTUAL_STUDY_ID,
  VIRTUAL_STUDY_CLEAN_ERROR,
  VIRTUAL_STUDY_DELETE_FAILURE,
  VIRTUAL_STUDY_DELETE_REQUESTED,
  VIRTUAL_STUDY_DELETE_SUCCESS,
  VIRTUAL_STUDY_LOAD_FAILURE,
  VIRTUAL_STUDY_LOAD_REQUESTED,
  VIRTUAL_STUDY_LOAD_SUCCESS,
  VIRTUAL_STUDY_RESET,
  VIRTUAL_STUDY_SAVE_FAILURE,
  VIRTUAL_STUDY_SAVE_REQUESTED,
  VIRTUAL_STUDY_SAVE_SUCCESS,
} from '../virtualStudiesActionTypes';

const api = apiInitialized;

const assertStudyId = (id) => {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(`Study id must be a non-empty string, but got "${id}"`);
  }
};

const assertStudyName = (name) => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Study name cannot be empty');
  }
};

const assertUser = (user) => {
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

export const fetchVirtualStudiesCollection = (uid) => (dispatch) => {
  dispatch({
    type: FETCH_VIRTUAL_STUDIES_REQUESTED,
    payload: uid,
  });

  return getVirtualStudies(api, uid)
    .then((virtualStudies) => {
      dispatch({
        type: FETCH_VIRTUAL_STUDIES_SUCCESS,
        payload: virtualStudies,
      });
    })
    .catch((err) => {
      dispatch({
        type: FETCH_VIRTUAL_STUDIES_FAILURE,
        payload: err,
      });
      console.error(`Error fetching virtual studies collection for uid "${uid}"`, err.message);
    });
};

export const loadSavedVirtualStudy = (virtualStudyId) => (dispatch) => {
  dispatch({
    type: VIRTUAL_STUDY_LOAD_REQUESTED,
    payload: virtualStudyId,
  });
  return getVirtualStudy(api)(virtualStudyId)
    .then((virtualStudy) =>
      dispatch({
        type: VIRTUAL_STUDY_LOAD_SUCCESS,
        payload: virtualStudy,
      }),
    )
    .catch((err) => {
      dispatch({
        type: VIRTUAL_STUDY_LOAD_FAILURE,
        payload: err.message,
      });
      console.error(err.message);
    });
};

export const saveVirtualStudy = (user, study) => (dispatch) => {
  try {
    assertStudyName(study.name);
    assertUser(user);
  } catch (err) {
    return Promise.reject(err);
  }

  dispatch({
    type: VIRTUAL_STUDY_SAVE_REQUESTED,
    payload: study,
  });

  const saveDelegate = study.virtualStudyId ? updateVirtualStudy : createNewVirtualStudy;
  return saveDelegate(api, user, study)
    .then(([newStudy, updatedStudies]) => {
      dispatch({
        type: VIRTUAL_STUDY_SAVE_SUCCESS,
        payload: {
          virtualStudyId: newStudy.virtualStudyId,
          uid: newStudy.uid,
          name: newStudy.name,
          description: newStudy.description,
        },
      });
      dispatch({
        type: FETCH_VIRTUAL_STUDIES_SUCCESS,
        payload: updatedStudies,
      });
    })
    .catch((err) => {
      dispatch({
        type: VIRTUAL_STUDY_SAVE_FAILURE,
        payload: err,
      });
    });
};

export const deleteVirtualStudy = ({ virtualStudyId, user }) => async (dispatch) => {
  assertStudyId(virtualStudyId);
  assertUser(user);

  dispatch({
    type: VIRTUAL_STUDY_DELETE_REQUESTED,
    payload: virtualStudyId,
  });

  return deleteVirtualStudyApi({ virtualStudyId, api, user })
    .then(() => dispatch(fetchVirtualStudiesCollection(user.egoId)))
    .then(() => {
      dispatch({
        type: VIRTUAL_STUDY_DELETE_SUCCESS,
        payload: virtualStudyId,
      });
    })
    .catch((err) => {
      dispatch({
        type: VIRTUAL_STUDY_DELETE_FAILURE,
        payload: err,
      });
    });
};

export const resetVirtualStudy = () => ({
  type: VIRTUAL_STUDY_RESET,
  payload: null,
});

export const setActiveSqonIndex = (activeIndex) => ({
  type: SET_ACTIVE_INDEX,
  payload: activeIndex,
});

export const setSqons = (sqons) => ({
  type: SET_SQONS,
  payload: sqons,
});

export const setVirtualStudyId = (virtualStudyId) => ({
  type: SET_VIRTUAL_STUDY_ID,
  payload: virtualStudyId,
});

export const cleanError = () => ({
  type: VIRTUAL_STUDY_CLEAN_ERROR,
});

export const addTermToActiveIndex = (term, sqonOp) => (dispatch) => {
  dispatch({
    type: ADD_TERM_TO_CURRENT_VIRTUAL_STUDY,
    payload: {
      term: term,
      sqonOp,
    },
  });
};
