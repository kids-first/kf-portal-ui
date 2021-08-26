import { RootState } from '../rootState';

export const selectErrorSubscribeUser = (state: RootState) => state.user.errorSubscribing;
export const selectIsLoadingUser = (state: RootState) => state.user.isLoadingUser;
export const selectUser = (state: RootState) => state?.user?.user;
export const selectIsUserAdmin = (state: RootState) => state.user.user?.isAdmin || false;
export const selectUserGroups = (state: RootState) => state.user.user?.groups || [];
