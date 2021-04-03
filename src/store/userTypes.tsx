//  Fill up when going from Js to Typescript...
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './rootState';

export type LoggedInUser = {
  _id: string;
  roles: Array<string>;
  egoId: string;
  email: string;
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

export type UserState = {
  loggedInUser: LoggedInUser;
  uid: string;
  isProfileLoading: boolean;
  profile: any;
  errorProfile: Error | null;
  isTogglingProfileStatus: boolean;
  isTogglingProfileStatusInError: Error | null;
  isProfileUpdating: boolean;
  errorSubscribing: Error | null;
};

export type EgoGroups = string[] | undefined | null;

export type DispatchUser = ThunkDispatch<RootState, null, any>;
