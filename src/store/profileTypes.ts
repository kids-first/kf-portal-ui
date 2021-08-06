import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { RootState } from './rootState';
import { Nullable } from './utilityTypes';

export type ProfileTodo = { [index: string]: any };

export enum ProfileActions {
  requestProfile = 'requestProfile',
  receiveProfile = 'receiveProfile',
  failureProfile = 'failureProfile',
  updateProfileSuccess = 'updateProfileSuccess',
  requestUpdateProfile = 'requestUpdateProfile',
  failureUpdateProfile = 'failureUpdateProfile',
  requestIsPublicToggle = 'requestIsPublicToggle',
  receiveIsPublicToggle = 'receiveIsPublicToggle',
  requestIsActiveToggle = 'requestIsActiveToggle',
  receiveIsActiveToggle = 'receiveIsActiveToggle',
  failureIsPublicToggle = 'failureIsPublicToggle',
  failureIsActiveToggle = 'failureIsActiveToggle',
  cleanProfileErrors = 'cleanProfileErrors',
  deleteProfile = 'deleteProfile',
}

export type RequestProfileAction = {
  type: ProfileActions.requestProfile;
};

export type ReceivedProfileAction = {
  type: ProfileActions.receiveProfile;
  payload: ProfileTodo;
};

export type FailureProfileAction = {
  type: ProfileActions.failureProfile;
  payload: Error;
};

export type UpdateProfileSuccessAction = {
  type: ProfileActions.updateProfileSuccess;
  payload: ProfileTodo;
};

export type RequestUpdateProfileAction = {
  type: ProfileActions.requestUpdateProfile;
};

export type FailureUpdateProfileAction = {
  type: ProfileActions.failureUpdateProfile;
  payload: Error;
};

export type RequestIsPublicToggleAction = {
  type: ProfileActions.requestIsPublicToggle;
};

export type RequestIsActiveToggleAction = {
  type: ProfileActions.requestIsActiveToggle;
};

export type ReceivedIsPublicToggleAction = {
  type: ProfileActions.receiveIsPublicToggle;
};

export type ReceivedIsActiveToggleAction = {
  type: ProfileActions.receiveIsActiveToggle;
};

export type FailureIsPublicToggleAction = {
  type: ProfileActions.failureIsPublicToggle;
  payload: Error;
};

export type FailureIsActiveToggleAction = {
  type: ProfileActions.failureIsActiveToggle;
  payload: Error;
};

export type DeleteProfileAction = {
  type: ProfileActions.deleteProfile;
};

export type ClearErrorsAction = {
  type: ProfileActions.cleanProfileErrors;
};

export type ProfileState = {
  profile: ProfileTodo;
  isProfileLoading: boolean;
  errorProfile: Nullable<Error>;
  isTogglingProfileStatus: boolean;
  isTogglingProfileStatusInError: Nullable<Error>;
  isProfileUpdating: boolean;
};

export type ProfileActionTypes =
  | RequestProfileAction
  | ReceivedProfileAction
  | FailureProfileAction
  | UpdateProfileSuccessAction
  | RequestUpdateProfileAction
  | FailureUpdateProfileAction
  | RequestIsPublicToggleAction
  | RequestIsActiveToggleAction
  | ReceivedIsPublicToggleAction
  | ReceivedIsActiveToggleAction
  | FailureIsPublicToggleAction
  | FailureIsActiveToggleAction
  | DeleteProfileAction
  | ClearErrorsAction;

export type DispatchProfile = ThunkDispatch<RootState, null, ProfileActionTypes>;
export type ThunkActionProfile = ThunkAction<void, RootState, null, ProfileActionTypes>;
