import {
  FETCH_VIRTUAL_STUDIES_REQUESTED,
  FETCH_VIRTUAL_STUDIES_SUCCESS,
  FETCH_VIRTUAL_STUDIES_FAILURE,
} from '../actionTypes';

const initialState = {
  studies: [],
  isLoading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VIRTUAL_STUDIES_REQUESTED:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_VIRTUAL_STUDIES_SUCCESS:
      return {
        ...state,
        studies: action.payload,
        isLoading: false,
      };

    case FETCH_VIRTUAL_STUDIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
