import {
  LOAD_VIRTUAL_STUDY,
  SET_ACTIVE_INDEX,
  SET_SQONS,
  SET_VIRTUAL_STUDY_ID,
} from '../actionTypes';
import { getVirtualStudy } from 'services/virtualStudies';
import { initializeApi } from 'services/api';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

export const loadSavedVirtualStudy = virtualStudyId => {
  return dispatch =>
    getVirtualStudy(api)(virtualStudyId)
      .then(virtualStudy => {
        const {
          uid,
          content: { sqons, activeIndex },
        } = virtualStudy;

        dispatch({
          type: LOAD_VIRTUAL_STUDY,
          payload: {
            sqons,
            activeIndex,
            uid,
            virtualStudyId,
          },
        });
      })
      .catch(err => {
        console.error(err.message);
      });
};

export const resetVirtualStudy = () => ({
  type: LOAD_VIRTUAL_STUDY,
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
