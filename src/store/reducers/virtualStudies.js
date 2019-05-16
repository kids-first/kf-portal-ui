import { cloneDeep } from 'lodash';

import {
  LOAD_VIRTUAL_STUDY,
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
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_VIRTUAL_STUDY:
      return action.payload === null
        ? cloneDeep(initialState)
        : {
            ...state,
            ...action.payload,
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
