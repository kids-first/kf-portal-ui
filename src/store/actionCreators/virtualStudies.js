import {
  VIRTUAL_STUDY_LOAD_REQUESTED,
  VIRTUAL_STUDY_LOAD_SUCCESS,
  VIRTUAL_STUDY_LOAD_FAILURE,
  FETCH_VIRTUAL_STUDIES_REQUESTED,
  FETCH_VIRTUAL_STUDIES_SUCCESS,
  FETCH_VIRTUAL_STUDIES_FAILURE,
  VIRTUAL_STUDY_SAVE_REQUESTED,
  VIRTUAL_STUDY_SAVE_SUCCESS,
  VIRTUAL_STUDY_SAVE_FAILURE,
  VIRTUAL_STUDY_DELETE_REQUESTED,
  VIRTUAL_STUDY_DELETE_SUCCESS,
  VIRTUAL_STUDY_DELETE_FAILURE,
  VIRTUAL_STUDY_RESET,
  SET_ACTIVE_INDEX,
  SET_SQONS,
  SET_VIRTUAL_STUDY_ID,
} from '../actionTypes';
import {
  getVirtualStudy,
  getVirtualStudies,
  createNewVirtualStudy,
  updateVirtualStudy,
  deleteVirtualStudy as deleteVirtualStudyApi,
} from '../../services/virtualStudies';
import { initializeApi } from '../../services/api';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

const assertStudyId = id => {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(`Study id must be a non-empty string, but got "${id}"`);
  }
};

const assertStudyName = name => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Study name cannot be empty');
  }
};

const assertUser = user => {
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

export const fetchVirtualStudiesCollection = uid => {
  return dispatch => {
    dispatch({
      type: FETCH_VIRTUAL_STUDIES_REQUESTED,
      payload: uid,
    });

    return getVirtualStudies(api, uid)
      .then(virtualStudies => {
        dispatch({
          type: FETCH_VIRTUAL_STUDIES_SUCCESS,
          payload: virtualStudies,
        });
      })
      .catch(err => {
        dispatch({
          type: FETCH_VIRTUAL_STUDIES_FAILURE,
          payload: err,
        });
        console.error(`Error fetching virtual studies collection for uid "${uid}"`, err.message);
      });
  };
};

export const loadSavedVirtualStudy = virtualStudyId => {
  return dispatch => {
    dispatch({
      type: VIRTUAL_STUDY_LOAD_REQUESTED,
      payload: virtualStudyId,
    });
    return getVirtualStudy(api)(virtualStudyId)
      .then(virtualStudy => {
        return dispatch({
          type: VIRTUAL_STUDY_LOAD_SUCCESS,
          payload: virtualStudy,
        });
      })
      .catch(err => {
        dispatch({
          type: VIRTUAL_STUDY_LOAD_FAILURE,
          payload: err.message,
        });
        console.error(err.message);
      });
  };
};

export const saveVirtualStudy = (loggedInUser, study) => {
  return dispatch => {
    try {
      assertStudyName(study.name);
      assertUser(loggedInUser);
    } catch (err) {
      return Promise.reject(err);
    }

    dispatch({
      type: VIRTUAL_STUDY_SAVE_REQUESTED,
      payload: study,
    });

    const saveDelegate = study.virtualStudyId ? updateVirtualStudy : createNewVirtualStudy;
    return saveDelegate(api, loggedInUser, study)
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
      .catch(err => {
        dispatch({
          type: VIRTUAL_STUDY_SAVE_FAILURE,
          payload: err,
        });
      });
  };
};

export const deleteVirtualStudy = ({ virtualStudyId, loggedInUser }) => {
  return dispatch => {
    assertStudyId(virtualStudyId);
    assertUser(loggedInUser);

    dispatch({
      type: VIRTUAL_STUDY_DELETE_REQUESTED,
      payload: virtualStudyId,
    });

    return deleteVirtualStudyApi({ virtualStudyId, api, loggedInUser })
      .then(() => dispatch(fetchVirtualStudiesCollection(loggedInUser.egoId)))
      .then(() => {
        dispatch({
          type: VIRTUAL_STUDY_DELETE_SUCCESS,
          payload: virtualStudyId,
        });
      })
      .catch(err => {
        dispatch({
          type: VIRTUAL_STUDY_DELETE_FAILURE,
          payload: err,
        });
      });
  };
};

export const resetVirtualStudy = () => ({
  type: VIRTUAL_STUDY_RESET,
  payload: null,
});

export const setActiveSqonIndex = activeIndex => ({
  type: SET_ACTIVE_INDEX,
  payload: activeIndex,
});

export const setSqons = sqons => ({
  type: SET_SQONS,
  payload: sqons,
});

export const setVirtualStudyId = virtualStudyId => ({
  type: SET_VIRTUAL_STUDY_ID,
  payload: virtualStudyId,
});
