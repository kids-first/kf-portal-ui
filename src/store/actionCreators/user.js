import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actionTypes';

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

export const logout = () => {
  return {
    type: LOGOUT,
    payload: null,
  };
};
