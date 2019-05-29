import { cloneDeep, isEqual } from 'lodash';

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

const defaultSqon = [{ op: 'and', content: [] }];

export const initialState = {
  sqons: cloneDeep(defaultSqon),
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

const dirty = state => ({
  ...state,
  dirty: true,
  areSqonsEmpty: isEqual(state.sqons, defaultSqon),
});

export default (state = initialState, action) => {
  switch (action.type) {
    case '@@INIT':
      return {
        ...state,
        areSqonsEmpty: isEqual(state.sqons, defaultSqon),
      };
    case VIRTUAL_STUDY_LOAD_REQUESTED:
      return {
        ...cloneDeep(initialState),
        isLoading: true,
      };
    case VIRTUAL_STUDY_LOAD_SUCCESS:
      let newState = {
        ...cloneDeep(initialState),
        ...action.payload,
        isLoading: false,
      };
      newState.areSqonsEmpty = isEqual(newState.sqons, defaultSqon);
      return newState;
    case VIRTUAL_STUDY_LOAD_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case VIRTUAL_STUDY_RESET:
      return cloneDeep(initialState);

    case VIRTUAL_STUDY_SAVE_REQUESTED:
      return {
        ...state,
      };
    case VIRTUAL_STUDY_SAVE_SUCCESS:
      return {
        ...state,
        ...action.payload,
        dirty: false,
        areSqonsEmpty: false,
      };
    case VIRTUAL_STUDY_SAVE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case VIRTUAL_STUDY_DELETE_REQUESTED:
      return {
        ...state,
      };
    case VIRTUAL_STUDY_DELETE_SUCCESS:
      return cloneDeep(initialState);
    case VIRTUAL_STUDY_DELETE_FAILURE:
      return {
        ...state,
        err: action.payload,
      };

    case SET_ACTIVE_INDEX:
      return dirty({
        ...state,
        activeIndex: action.payload,
      });

    case SET_SQONS:
      return dirty({
        ...state,
        sqons: action.payload,
      });

    case SET_VIRTUAL_STUDY_ID:
      return dirty({
        ...state,
        virtualStudyId: action.payload,
      });

    case LOGOUT:
      return cloneDeep(initialState);

    default:
      return state;
  }
};
