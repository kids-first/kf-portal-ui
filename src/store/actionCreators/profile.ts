import {
  getOtherUserProfile,
  getProfile,
  toggleActiveProfileAsAdmin,
  updateProfile,
} from 'services/profiles';

import { Api } from '../apiTypes';
import {
  ProfileActions,
  ProfileActionTypes,
  ProfileTodo,
  ThunkActionProfile,
} from '../profileTypes';
import { RootState } from '../rootState';
import { selectProfile } from '../selectors/profile';
import { UserInfo } from '../userTypes';

export const requestProfile = (): ProfileActionTypes => ({
  type: ProfileActions.requestProfile,
});

export const receiveProfile = (fetchedProfile: ProfileTodo): ProfileActionTypes => ({
  type: ProfileActions.receiveProfile,
  payload: fetchedProfile,
});

export const failureProfile = (error: Error): ProfileActionTypes => ({
  type: ProfileActions.failureProfile,
  payload: error,
});

export const updateProfileSuccess = (updatedProfile: ProfileTodo): ProfileActionTypes => ({
  type: ProfileActions.updateProfileSuccess,
  payload: updatedProfile,
});

export const requestUpdateProfile = (): ProfileActionTypes => ({
  type: ProfileActions.requestUpdateProfile,
});

export const failureUpdateProfile = (error: Error): ProfileActionTypes => ({
  type: ProfileActions.failureUpdateProfile,
  payload: error,
});

export const requestIsPublicToggle = (): ProfileActionTypes => ({
  type: ProfileActions.requestIsPublicToggle,
});

export const requestIsActiveToggle = (): ProfileActionTypes => ({
  type: ProfileActions.requestIsActiveToggle,
});

export const receiveIsPublicToggle = (): ProfileActionTypes => ({
  type: ProfileActions.receiveIsPublicToggle,
});

export const receiveIsActiveToggle = (): ProfileActionTypes => ({
  type: ProfileActions.receiveIsActiveToggle,
});

export const failureIsPublicToggle = (error: Error): ProfileActionTypes => ({
  type: ProfileActions.failureIsPublicToggle,
  payload: error,
});

export const failureIsActiveToggle = (error: Error): ProfileActionTypes => ({
  type: ProfileActions.failureIsActiveToggle,
  payload: error,
});

export const cleanProfileErrors = (): ProfileActionTypes => ({
  type: ProfileActions.cleanProfileErrors,
});

export const deleteProfile = (): ProfileActionTypes => ({ type: ProfileActions.deleteProfile });

const fetchProfile = (userInfo: UserInfo): ThunkActionProfile => async (dispatch) => {
  dispatch(requestProfile());
  try {
    const fetchedProfile = await (userInfo.isSelf
      ? getProfile()
      : getOtherUserProfile(userInfo.userID));
    dispatch(receiveProfile(fetchedProfile));
  } catch (e) {
    dispatch(failureProfile(e));
  }
};

const shouldFetchProfile = (state: RootState, userInfo: UserInfo) => {
  const profileInStore = selectProfile(state);
  return !profileInStore || profileInStore._id !== userInfo.userID;
};

export const fetchProfileIfNeeded = (userInfo: UserInfo): ThunkActionProfile => (
  dispatch,
  getState,
) => {
  if (shouldFetchProfile(getState(), userInfo)) {
    return dispatch(fetchProfile(userInfo));
  }
};

export const updateUserProfile = (api: Api, profile: ProfileTodo): ThunkActionProfile => async (
  dispatch,
) => {
  dispatch(requestUpdateProfile());
  try {
    const updatedProfile = await updateProfile(api)({
      user: profile,
    });
    dispatch(updateProfileSuccess(updatedProfile));
  } catch (e) {
    dispatch(failureUpdateProfile(e));
  }
};

export const toggleIsPublic = (api: Api, profile: ProfileTodo): ThunkActionProfile => async (
  dispatch,
) => {
  dispatch(requestIsPublicToggle());
  try {
    await updateProfile(api)({
      user: profile,
    });
    dispatch(receiveIsPublicToggle());
  } catch (e) {
    dispatch(failureIsPublicToggle(e));
  }
};

export const toggleIsActive = (api: Api, profile: ProfileTodo): ThunkActionProfile => async (
  dispatch,
) => {
  dispatch(requestIsActiveToggle());
  try {
    await toggleActiveProfileAsAdmin(api)({
      user: profile,
    });
    dispatch(receiveIsActiveToggle());
  } catch (e) {
    dispatch(failureIsActiveToggle(e));
  }
};
