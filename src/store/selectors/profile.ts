import { RootState } from '../rootState';

export const selectProfile = (state: RootState) => state.profile.profile;
export const selectIsProfileLoading = (state: RootState) => state.profile.isProfileLoading;
export const selectErrorProfile = (state: RootState) => state.profile.errorProfile;
export const selectIsLoadingProfileStatus = (state: RootState) =>
  state.profile.isTogglingProfileStatus;
export const selectErrorIsToggleProfileStatus = (state: RootState) =>
  state.profile.isTogglingProfileStatusInError;
export const selectIsProfileUpdating = (state: RootState) => state.profile.isProfileUpdating;
export const selectErrorSubscribeUser = (state: RootState) => state.user.errorSubscribing;
