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
import { apiInitialized } from 'services/api';
import {getProfileNew, updateProfile} from 'services/profiles';

const getProfileFromUserID = getProfileNew(apiInitialized);
const updateProfileFromUser = updateProfile(apiInitialized);

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

export const requestProfile = () => {
  return {
    type: REQUEST_PROFILE,
  };
};

export const receiveProfile = fetchedProfile => {
  return {
    type: RECEIVE_PROFILE,
    payload: fetchedProfile,
  };
};

export const failureProfile = error => {
  return {
    type: FAILURE_PROFILE,
    payload: error,
  };
};

export const updateProfileSuccess = () => {
  return {
    type: UPDATE_USER_SUCCESS,
  };
};

const fetchProfile = (userID, loggedInUser) => {
  return async dispatch => {
    const onSuccess = profile => {
      return dispatch(receiveProfile(profile));
    };
    const onError = error => {
      return dispatch(failureProfile(error));
    };

    dispatch(requestProfile());

    try {
      const fetchedProfile = await getProfileFromUserID(userID, loggedInUser);
      return onSuccess(fetchedProfile);
    } catch (e) {
      return onError(e);
    }
  };
};

const shouldFetchProfile = (state, userID) => {
  const profileInStore = state.profile;
  return !Boolean(profileInStore) || (Boolean(profileInStore._id) && profileInStore._id !== userID);
};

export const fetchProfileIfNeeded = (userID, loggedInUser) => {
  return (dispatch, getState) => {
    if (shouldFetchProfile(getState(), userID)) {
      return dispatch(fetchProfile(userID, loggedInUser));
    }
  };
};

export const requestUpdateProfile = () => {
  return {
    type: REQUEST_PROFILE_UPDATE,
  };
};

export const failureUpdateProfile = error => {
  return {
    type: FAILURE_UPDATE,
    payload: error,
  };
};
export const updateUserProfile = user => {
  return async dispatch => {
    dispatch(requestUpdateProfile());

    try {
      await updateProfileFromUser({
        user,
      });
      return dispatch(updateProfileSuccess());
    } catch (e) {
      return dispatch(receiveProfile(failureProfile(e)));
    }
  };
};
