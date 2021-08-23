import { RootState } from '../rootState';

export const selectErrorSubscribeUser = (state: RootState) => state.user.errorSubscribing;
export const selectIsLoadingUser = (state: RootState) => state.user.isLoadingUser;
export const selectUser = (state: RootState) => state.user.user;
export const selectLoginProvider = (state: RootState) => state.user.loginProvider;
export const selectUserToken = (state: RootState) => state.user.userToken;
export const selectIsUserAdmin = (state: RootState) => state.user.user?.isAdmin || false;
export const selectUserGroups = (state: RootState) => state.user.user?.groups || [];
export const selectIsUserAuthenticated = (state: RootState) => state.user.isAuthenticated;
