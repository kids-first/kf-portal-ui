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
  DELETE_PROFILE,
  REQUEST_IS_PUBLIC_TOGGLE,
  RECEIVE_IS_PUBLIC_TOGGLE,
  FAILURE_IS_PUBLIC_TOGGLE,
  CLEAN_ERRORS,
  REQUEST_IS_ACTIVE_TOGGLE,
  RECEIVE_IS_ACTIVE_TOGGLE,
  FAILURE_IS_ACTIVE_TOGGLE,
  FAILURE_SUBSCRIBE_USER,
  REQUEST_SUBSCRIBE_USER,
} from '../actionTypes';
import { apiInitialized } from 'services/api';
import {
  getOtherUserProfile,
  getUserLoggedInProfile,
  updateProfile,
  toggleActiveProfileAsAdmin,
  subscribeUser,
} from 'services/profiles';
import { selectProfile } from '../selectors/users';

const updateProfileFromUser = updateProfile(apiInitialized);
const toggleActiveProfileFromUser = toggleActiveProfileAsAdmin(apiInitialized);

export const loginSuccess = (loggedInUser) => ({
  type: LOGIN_SUCCESS,
  payload: loggedInUser,
});

export const loginFailure = () => ({
  type: LOGIN_FAILURE,
  payload: null,
});

export const logout = () => ({
  type: LOGOUT,
  payload: null,
});

export const requestProfile = () => ({
  type: REQUEST_PROFILE,
});

export const receiveProfile = (fetchedProfile) => ({
  type: RECEIVE_PROFILE,
  payload: fetchedProfile,
});

export const failureProfile = (error) => ({
  type: FAILURE_PROFILE,
  payload: error,
});

export const updateProfileSuccess = (updatedProfile) => ({
  type: UPDATE_USER_SUCCESS,
  payload: updatedProfile,
});

const fetchProfile = (userInfo) => async (dispatch) => {
  const onSuccess = (profile) => dispatch(receiveProfile(profile));
  const onError = (error) => dispatch(failureProfile(error));

  dispatch(requestProfile());
  try {
    const fetchedProfile = await (userInfo.isSelf
      ? getUserLoggedInProfile()
      : getOtherUserProfile(userInfo.userID));
    return onSuccess(fetchedProfile);
  } catch (e) {
    return onError(e);
  }
};

const shouldFetchProfile = (state, userInfo) => {
  const profileInStore = selectProfile(state);
  if (!profileInStore) {
    return true;
  }
  return profileInStore._id !== userInfo.userID;
};

export const fetchProfileIfNeeded = (userInfo) => (dispatch, getState) => {
  if (shouldFetchProfile(getState(), userInfo)) {
    return dispatch(fetchProfile(userInfo));
  }
};

export const requestUpdateProfile = () => ({
  type: REQUEST_PROFILE_UPDATE,
});

export const failureUpdateProfile = (error) => ({
  type: FAILURE_UPDATE,
  payload: error,
});

export const updateUserProfile = (user) => async (dispatch) => {
  dispatch(requestUpdateProfile());
  try {
    const updatedProfile = await updateProfileFromUser({
      user,
    });
    return dispatch(updateProfileSuccess(updatedProfile));
  } catch (e) {
    return dispatch(failureUpdateProfile(e));
  }
};

export const requestIsPublicToggle = () => ({
  type: REQUEST_IS_PUBLIC_TOGGLE,
});

export const requestIsActiveToggle = () => ({
  type: REQUEST_IS_ACTIVE_TOGGLE,
});

export const receiveIsPublicToggle = () => ({
  type: RECEIVE_IS_PUBLIC_TOGGLE,
});

export const receiveIsActiveToggle = () => ({
  type: RECEIVE_IS_ACTIVE_TOGGLE,
});

export const failureIsPublicToggle = (error) => ({
  type: FAILURE_IS_PUBLIC_TOGGLE,
  payload: error,
});

export const failureIsActiveToggle = (error) => ({
  type: FAILURE_IS_ACTIVE_TOGGLE,
  payload: error,
});

export const toggleIsPublic = (user) => async (dispatch) => {
  dispatch(requestIsPublicToggle());
  try {
    await updateProfileFromUser({
      user,
    });
    return dispatch(receiveIsPublicToggle());
  } catch (e) {
    return dispatch(failureIsPublicToggle(e));
  }
};

export const toggleIsActive = (user) => async (dispatch) => {
  dispatch(requestIsActiveToggle());
  try {
    await toggleActiveProfileFromUser({
      user,
    });
    return dispatch(receiveIsActiveToggle());
  } catch (e) {
    return dispatch(failureIsActiveToggle(e));
  }
};

export const deleteProfile = () => (dispatch) => dispatch({ type: DELETE_PROFILE });

export const cleanErrors = () => ({ type: CLEAN_ERRORS });

export const requestSubscribeUser = () => ({
  type: REQUEST_SUBSCRIBE_USER,
});

export const failureSubscribeUser = (error) => ({
  type: FAILURE_SUBSCRIBE_USER,
  payload: error,
});

export const subscribeLoggedInUser = (loggedInUser) => async (dispatch) => {
  dispatch(requestSubscribeUser());
  try {
    await subscribeUser(loggedInUser);
  } catch (e) {
    return dispatch(failureSubscribeUser(e));
  }
};
