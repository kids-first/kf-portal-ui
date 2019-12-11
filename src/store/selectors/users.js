export const selectProfile = state => state.user.profile;
export const selectLoggedInUser = state => state.user.loggedInUser;
export const selectIsProfileLoading = state => state.user.isProfileLoading;
export const selectErrorProfile = state => state.user.errorProfile;
export const selectIsLoadingProfileStatus = state => state.user.isTogglingProfileStatus;
export const selectErrorIsToggleProfileStatus = state => state.user.isTogglingProfileStatusInError;
export const selectIsProfileUpdating = state => state.user.isProfileUpdating;
