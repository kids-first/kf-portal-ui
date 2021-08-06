import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { RootState } from './rootState';
import { Nullable } from './utilityTypes';

export type Groups = string[];

export enum Providers {
  google = 'google',
  facebook = 'facebook',
  orcid = 'orcid',
}

export type Provider = string;

export type User = {
  _id: string;
  roles: Array<string>;
  egoId: string;
  acceptedDatasetSubscriptionKfOptIn: boolean;
  acceptedKfOptIn: boolean;
  acceptedNihOptIn: boolean;
  acceptedTerms: boolean;
  hashedEmail?: string;
  email: string;
  firstName: string;
  lastName: string;
  groups: Groups;
  isAdmin: boolean;
  isPublic: boolean;
  [index: string]: any;
};

export type UserInfo = {
  userID: string;
  isSelf: boolean;
};

export type Profile = {
  _id: string;
  roles: Array<string>;
  egoId: string;
  acceptedDatasetSubscriptionKfOptIn: boolean;
  acceptedKfOptIn: boolean;
  acceptedNihOptIn: boolean;
  acceptedTerms: boolean;
  addressLine1?: string;
  addressLine2?: string;
  bio?: string;
  city?: string;
  country?: string;
  department?: string;
  eraCommonsID?: string;
  facebook?: string;
  firstName?: string;
  github?: string;
  googleScholarId?: string;
  hashedEmail?: string;
  institution?: string;
  institutionalEmail?: string;
  interests?: Array<string>;
  isActive?: boolean;
  isPublic?: boolean;
  jobTitle?: string;
  lastName?: string;
  linkedin?: string;
  orchid?: string;
  phone?: string;
  sets?: Array<string>;
  state?: string;
  story?: string;
  title?: string;
  twitter?: string;
  website?: string;
  zip?: string;
};

export type LoggedInUser = Profile & { email: string };

export enum UserActions {
  logout = 'logout',
  requestSubscribeUser = 'requestSubscribeUser',
  failureSubscribeUser = 'failureSubscribeUser',
  toggleIsLoadingUser = 'toggleIsLoadingUser',
  receiveUser = 'receiveUser',
  receiveLoginProvider = 'receiveLoginProvider',
  receiveUserToken = 'receiveUserToken',
  updateUser = 'updateUser',
}

export type UpdateUser = {
  type: UserActions.updateUser;
  updatedUser: User;
};

export type LogoutAction = {
  type: UserActions.logout;
};

export type RequestSubscribeUserAction = {
  type: UserActions.requestSubscribeUser;
};

export type FailureSubscribeUserAction = {
  type: UserActions.failureSubscribeUser;
  payload: Error;
};

export type ToggleIsLoadingUserAction = {
  type: UserActions.toggleIsLoadingUser;
  isLoading: boolean;
};

export type ReceiveUserAction = {
  type: UserActions.receiveUser;
  payload: User;
};

export type ReceiveLoginProvider = {
  type: UserActions.receiveLoginProvider;
  loginProvider: string;
};

export type ReceiveUserToken = {
  type: UserActions.receiveUserToken;
  userToken: string;
};

export type UserState = {
  isLoadingUser: boolean;
  uid: Nullable<string>;
  errorSubscribing: Nullable<Error>;
  user: User | null;
  isAuthenticated: boolean;
  loginProvider: Nullable<string>;
  userToken: Nullable<string>;
};

export const userInitialState: UserState = {
  isLoadingUser: false,
  uid: null,
  errorSubscribing: null,
  user: null,
  isAuthenticated: false,
  loginProvider: null,
  userToken: null,
};

export type UserActionTypes =
  | LogoutAction
  | RequestSubscribeUserAction
  | FailureSubscribeUserAction
  | ToggleIsLoadingUserAction
  | ReceiveUserAction
  | ReceiveLoginProvider
  | ReceiveUserToken
  | UpdateUser;

export type DispatchUser = ThunkDispatch<RootState, null, UserActionTypes>;
export type ThunkActionUser = ThunkAction<void, RootState, null, UserActionTypes>;
