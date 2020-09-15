import { RootState } from '../rootState';

export const selectProfile = (state: RootState) => state.user.profile;
export const selectLoggedInUser = (state: RootState) => state.user.loggedInUser;
export const selectIsProfileLoading = (state: RootState) => state.user.isProfileLoading;
export const selectErrorProfile = (state: RootState) => state.user.errorProfile;
export const selectIsLoadingProfileStatus = (state: RootState) =>
  state.user.isTogglingProfileStatus;
export const selectErrorIsToggleProfileStatus = (state: RootState) =>
  state.user.isTogglingProfileStatusInError;
export const selectIsProfileUpdating = (state: RootState) => state.user.isProfileUpdating;
export const selectErrorSubscribeUser = (state: RootState) => state.user.errorSubscribing;
