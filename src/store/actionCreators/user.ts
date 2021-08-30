// @ts-ignore
import { addHeaders as addArrangerHeaders } from '@kfarranger/components/dist';
import keycloak from 'keycloak';
import { KeycloakTokenParsed } from 'keycloak-js';

import { EGO_JWT_KEY, LOGIN_PROVIDER, SHOW_DELETE_ACCOUNT } from 'common/constants';
import { trackUserSession } from 'services/analyticsTracking';
import { apiUser } from 'services/api';
import {
  deleteProfile,
  getProfile,
  initProfile,
  subscribeUser as subscribeUserService,
  updateProfile,
} from 'services/profiles';
import { Api } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import { selectUser } from 'store/selectors/users';
import { KcTokenParsedPlusClaims } from 'store/tokenTypes';

import { removeForumBanner } from '../../ForumBanner';
import { RawUser, ThunkActionUser, User, UserActions, UserActionTypes } from '../userTypes';

import { deleteAllSaveQueriesFromRiffForUser } from './SavedQueries';

const isAdminFromRoles = (roles: string[] | null) => (roles || []).includes('ADMIN');

export const logout = (): UserActionTypes => ({
  type: UserActions.logout,
});

export const requestSubscribeUser = (): UserActionTypes => ({
  type: UserActions.requestSubscribeUser,
});

export const failureSubscribeUser = (error: Error): UserActionTypes => ({
  type: UserActions.failureSubscribeUser,
  payload: error,
});

export const receiveUserWithComputedValues = (user: User): UserActionTypes => ({
  type: UserActions.receiveUserWithComputedValues,
  payload: user,
});

export const receiveUser = (user: RawUser): ThunkActionUser => async (dispatch) => {
  //expect to always receive a token before accepting a user
  const enhancedUser: User = {
    ...user,
    isAdmin: isAdminFromRoles(user.roles),
    groups: (keycloak?.tokenParsed as KcTokenParsedPlusClaims)?.groups || [],
  };
  await trackUserSession({ ...enhancedUser });
  dispatch(receiveUserWithComputedValues(enhancedUser));
};

export const toggleIsLoadingUser = (isLoading: boolean): UserActionTypes => ({
  type: UserActions.toggleIsLoadingUser,
  isLoading,
});

export const subscribeUser = (): ThunkActionUser => async (dispatch, getState) => {
  dispatch(requestSubscribeUser());
  const userInMemory = selectUser(getState());
  try {
    await subscribeUserService(userInMemory);
  } catch (e) {
    dispatch(failureSubscribeUser(e));
  }
};

export const revertAcceptedTerms = (): ThunkActionUser => async (dispatch, getState) => {
  const currentState = getState();
  const userInMemory = selectUser(currentState);
  try {
    let user = userInMemory;
    if (!userInMemory) {
      user = await getProfile();
    }

    if (user && user.acceptedTerms) {
      await updateProfile(apiUser)({
        user: {
          ...user,
          acceptedTerms: false,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const cleanLegacyItems = () => {
  //clean storage for users transitioning to keycloak.
  localStorage.removeItem(EGO_JWT_KEY);
  localStorage.removeItem(LOGIN_PROVIDER);
};

export const cleanlyLogout = (): ThunkActionUser => async (dispatch) => {
  dispatch(toggleIsLoadingUser(true));
  try {
    await keycloak.logout({
      redirectUri: `${window.location.origin}`,
    });
  } catch (error) {
    console.error(error);
  } finally {
    cleanLegacyItems();
    removeForumBanner();
    localStorage.removeItem(SHOW_DELETE_ACCOUNT);
    addArrangerHeaders({ authorization: `` });
    await dispatch(logout());
  }
};

export const revertAcceptedTermsThenLogoutCleanly = (): ThunkActionUser => async (dispatch) => {
  await dispatch(revertAcceptedTerms());
  await dispatch(cleanlyLogout());
};

const bGUARD = false;

export const fetchUser = (kcTokenParsed: KeycloakTokenParsed): ThunkActionUser => async (
  dispatch,
) => {
  try {
    const userPayload = kcTokenParsed.sub;
    const sub = kcTokenParsed.sub;
    const existingProfile = await getProfile();
    let profile = existingProfile;
    if (bGUARD && !existingProfile) {
      //FIXME what to do when user is new?
      profile = await initProfile(apiUser, userPayload, sub);
    }
    dispatch(receiveUser(profile));
  } catch (error) {
    console.error(error);
    dispatch(cleanlyLogout());
  }
};

export const shouldFetchUser = (state: RootState) => !selectUser(state);

export const fetchUserIfNeeded = (
  kcTokenParsed: KeycloakTokenParsed | undefined,
): ThunkActionUser => async (dispatch, getState) => {
  if (kcTokenParsed && shouldFetchUser(getState())) {
    return dispatch(fetchUser(kcTokenParsed));
  }
};

export const fetchUserIfNeededWithLoader = (): ThunkActionUser => async (dispatch) => {
  dispatch(toggleIsLoadingUser(true));
  const token = keycloak?.token;
  addArrangerHeaders({ authorization: `Bearer ${token}` });
  await dispatch(fetchUserIfNeeded(keycloak?.tokenParsed));
  dispatch(toggleIsLoadingUser(false));
};

export const updateUser = (user: User): ThunkActionUser => async (dispatch) => {
  try {
    const updatedProfile = await updateProfile(apiUser)({
      user,
    });
    dispatch(receiveUser(updatedProfile));
  } catch (error) {
    console.error(error);
  }
};

export const acceptTerms = (user: User, cb: () => Promise<void>): ThunkActionUser => async (
  dispatch,
) => {
  try {
    const updatedProfile = await updateProfile(apiUser)({
      user: {
        ...user,
        acceptedTerms: true,
      },
    });

    await dispatch(receiveUser(updatedProfile));
    await cb();
  } catch (error) {
    console.error(error);
  }
};

export const deleteAccount = (api: Api, user: User): ThunkActionUser => async (dispatch) => {
  try {
    await deleteProfile(api)({
      user: {
        ...user,
      },
    });
    await dispatch(deleteAllSaveQueriesFromRiffForUser(api, user));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(cleanlyLogout());
  }
};
