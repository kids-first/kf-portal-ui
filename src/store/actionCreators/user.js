import { LOGIN_SUCCESS, LOGIN_FAILURE } from '../actionTypes';

export const loginSuccess = loggedInUser => {
  return {
    type: LOGIN_SUCCESS,
    payload: loggedInUser,
  };
};

export const loginFailure = () => {
  return {
    type: LOGIN_FAILURE,
    payload: null,
  };
};
