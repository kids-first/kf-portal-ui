import { cloneDeep } from 'lodash';
import { getDefaultSqon, isDefaultSqon } from 'common/sqonUtils';

import {
  VIRTUAL_STUDY_LOAD_REQUESTED,
  VIRTUAL_STUDY_LOAD_SUCCESS,
  VIRTUAL_STUDY_LOAD_FAILURE,
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
  LOGOUT,
} from '../actionTypes';

export const initialState = {
  sqons: getDefaultSqon(),
  activeIndex: 0,
  uid: null,
  virtualStudyId: null,
  name: '',
  description: '',
  dirty: false,
  areSqonsEmpty: true,
  isLoading: false,
  error: null,
};

const currySetState = state => (diff = {}) => {
  const newState = { ...state, ...diff };
  newState.areSqonsEmpty = isDefaultSqon(newState.sqons);
  return newState;
};

const resetState = (diff = {}) => {
  const newState = {
    ...cloneDeep(initialState),
    ...diff,
  };
  newState.areSqonsEmpty = isDefaultSqon(newState.sqons);
  return newState;
};

export default (state = initialState, action) => {
  const setState = currySetState(state);
  switch (action.type) {
    case VIRTUAL_STUDY_LOAD_REQUESTED:
      return resetState({
        isLoading: true,
      });
    case VIRTUAL_STUDY_LOAD_SUCCESS:
      return resetState({
        ...action.payload,
        isLoading: false,
      });
    case VIRTUAL_STUDY_LOAD_FAILURE:
      return setState({
        error: action.payload,
        isLoading: false,
      });

    case VIRTUAL_STUDY_RESET:
      return resetState();

    case VIRTUAL_STUDY_SAVE_REQUESTED:
      return state;
    case VIRTUAL_STUDY_SAVE_SUCCESS:
      return setState({
        ...action.payload,
        dirty: false,
        areSqonsEmpty: false,
      });
    case VIRTUAL_STUDY_SAVE_FAILURE:
      return setState({
        error: action.payload,
      });

    case VIRTUAL_STUDY_DELETE_REQUESTED:
      return state;
    case VIRTUAL_STUDY_DELETE_SUCCESS:
      return resetState();
    case VIRTUAL_STUDY_DELETE_FAILURE:
      return setState({
        error: action.payload,
      });

    case SET_ACTIVE_INDEX:
      return setState({
        dirty: true,
        activeIndex: action.payload,
      });

    case SET_SQONS:
      return setState({
        dirty: true,
        sqons: action.payload,
      });

    case SET_VIRTUAL_STUDY_ID:
      return setState({
        dirty: true,
        virtualStudyId: action.payload,
      });

    case LOGOUT:
      return cloneDeep(initialState);

    default:
      return state;
  }
};
