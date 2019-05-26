import { cloneDeep } from 'lodash';

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
} from '../actionTypes';

const initialState = {
  sqons: [
    {
      op: 'and',
      content: [],
    },
  ],
  activeIndex: 0,
  uid: null,
  virtualStudyId: null,
  isLoading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VIRTUAL_STUDY_LOAD_REQUESTED:
      return {
        ...cloneDeep(initialState),
        isLoading: true,
      };
    case VIRTUAL_STUDY_LOAD_SUCCESS:
      return {
        ...cloneDeep(initialState),
        ...action.payload,
        isLoading: false,
      };
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
      return {
        ...state,
        activeIndex: action.payload,
      };

    case SET_SQONS:
      return {
        ...state,
        sqons: action.payload,
      };

    case SET_VIRTUAL_STUDY_ID:
      return {
        ...state,
        virtualStudyId: action.payload,
      };

    default:
      return state;
  }
};
