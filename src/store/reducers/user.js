import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REQUEST_PROFILE,
  RECEIVE_PROFILE,
  FAILURE_PROFILE,
  REQUEST_PROFILE_UPDATE,
  FAILURE_UPDATE,
  UPDATE_USER_SUCCESS,
} from '../actionTypes';

const initialState = {
  loggedInUser: null,
  uid: null,
  isProfileLoading: false,
  profile: null,
  errorProfile: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedInUser: action.payload,
        uid: action.payload.egoId,
      };
    case LOGIN_FAILURE:
      return { ...initialState };
    case LOGOUT:
      return { ...initialState };
    case REQUEST_PROFILE:
      return { ...state, isProfileLoading: true };
    case RECEIVE_PROFILE:
      return { ...state, profile: action.payload, isProfileLoading: false };
    case FAILURE_PROFILE:
      return { ...state, errorProfile: action.payload, isProfileLoading: false };
    case REQUEST_PROFILE_UPDATE:
      return { ...state, isProfileLoading: true };
    case FAILURE_UPDATE:
      return { ...state, errorProfile: action.payload, isProfileLoading: false };
    case UPDATE_USER_SUCCESS:
      return { ...state, isProfileLoading: false };
    default:
      return state;
  }
};
