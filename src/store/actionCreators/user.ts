// @ts-ignore
import { addHeaders as addArrangerHeaders } from '@kfarranger/components/dist';
import jwtDecode from 'jwt-decode';

import { EGO_JWT_KEY, LOGIN_PROVIDER, SHOW_DELETE_ACCOUNT } from 'common/constants';
import { trackUserSession } from 'services/analyticsTracking';
import { apiUser } from 'services/api';
import { removeCookie, setCookie } from 'services/cookie';
import history from 'services/history';
import {
  facebookLogout,
  facebookRefreshToken,
  googleLogout,
  googleRefreshToken,
} from 'services/login';
import {
  deleteProfile,
  getProfile,
  initProfile,
  subscribeUser as subscribeUserService,
  updateProfile,
} from 'services/profiles';
import { Api } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import { selectLoginProvider, selectUser } from 'store/selectors/users';
import { DecodedJwt, JwtToken } from 'store/tokenTypes';
import { extractGroupsFromToken, isDecodedJwtExpired } from 'store/tokenUtils';

import ROUTES from '../../common/routes';
import {
  Provider,
  Providers,
  RawUser,
  ThunkActionUser,
  User,
  UserActions,
  UserActionTypes,
} from '../userTypes';
import { Nullable } from '../utilityTypes';

import { deleteAllSaveQueriesFromRiffForUser } from './SavedQueries';

const updateUserProfile = updateProfile(apiUser);
const deleteUserProfile = deleteProfile(apiUser);

const isAdminFromRoles = (roles: string[] | null) => (roles || []).includes('ADMIN');

const isStatusApproved = (status: string | null) => !!status && status.toLowerCase() === 'approved';

const setEgoTokenCookie = (token: string): void => {
  const decodedJwt: DecodedJwt = jwtDecode(token);
  const exp: number = decodedJwt.exp;
  const expires = new Date(exp * 1000);
  setCookie(EGO_JWT_KEY, token, {
    expires: expires,
  });
};

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

export const receiveUser = (user: RawUser): ThunkActionUser => async (dispatch, getState) => {
  const currentState = getState();
  //expect to always receive a token before accepting a user
  const userToken = currentState.user.userToken;
  const enhancedUser: User = {
    ...user,
    isAdmin: isAdminFromRoles(user.roles),
    groups: extractGroupsFromToken(userToken),
  };
  await trackUserSession({ ...enhancedUser });
  dispatch(receiveUserWithComputedValues(enhancedUser));
};

export const toggleIsLoadingUser = (isLoading: boolean): UserActionTypes => ({
  type: UserActions.toggleIsLoadingUser,
  isLoading,
});

export const receiveUserToken = (userToken: JwtToken): UserActionTypes => ({
  type: UserActions.receiveUserToken,
  userToken,
});

export const receiveLoginProvider = (loginProvider: Provider): UserActionTypes => ({
  type: UserActions.receiveLoginProvider,
  loginProvider,
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

const setTokenInStores = (token: JwtToken): ThunkActionUser => async (dispatch) => {
  setEgoTokenCookie(token);
  localStorage.setItem(EGO_JWT_KEY, token);
  addArrangerHeaders({ authorization: `Bearer ${token}` });
  dispatch(receiveUserToken(token));
};

const setLoginProviderInStores = (provider: Provider): ThunkActionUser => async (dispatch) => {
  localStorage.setItem(LOGIN_PROVIDER, provider);
  dispatch(receiveLoginProvider(provider));
};

const setTokenAndLoginProvider = (token: JwtToken, provider: Provider): ThunkActionUser => async (
  dispatch,
) => {
  dispatch(setTokenInStores(token));
  dispatch(setLoginProviderInStores(provider));
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
      await updateUserProfile({
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

export const cleanlyLogout = (): ThunkActionUser => async (dispatch, getState) => {
  try {
    const provider = selectLoginProvider(getState());
    // no implementation for orcid
    if (provider === Providers.google) {
      await googleLogout();
    } else if (provider === Providers.facebook) {
      await facebookLogout();
    }
  } catch (error) {
    console.error(error);
  } finally {
    removeCookie(EGO_JWT_KEY);
    localStorage.removeItem(EGO_JWT_KEY);
    localStorage.removeItem(LOGIN_PROVIDER);
    localStorage.removeItem(SHOW_DELETE_ACCOUNT);
    addArrangerHeaders({ authorization: `` });
    await dispatch(logout());
    history.push(ROUTES.login);
  }
};

export const revertAcceptedTermsThenLogoutCleanly = (): ThunkActionUser => async (dispatch) => {
  await dispatch(revertAcceptedTerms());
  await dispatch(cleanlyLogout());
};

export const validateDecodedJwt = (decodedJwt: DecodedJwt): ThunkActionUser => async (dispatch) => {
  if (!decodedJwt) {
    return dispatch(revertAcceptedTermsThenLogoutCleanly);
  }

  const roles = decodedJwt?.context?.user?.roles;
  if (isAdminFromRoles(roles)) {
    return;
  }
  const userStatus = decodedJwt?.context?.user?.status || '';
  const isApproved = isStatusApproved(userStatus);
  if (isApproved) {
    return;
  }
  return dispatch(revertAcceptedTermsThenLogoutCleanly);
};

export const fetchUserFromJwt = (validDecodedJwt: DecodedJwt): ThunkActionUser => async (
  dispatch,
) => {
  try {
    const userPayload = validDecodedJwt.context.user;
    const sub = validDecodedJwt.sub;
    const existingProfile = await getProfile();
    let profile = existingProfile;
    if (!existingProfile) {
      profile = await initProfile(apiUser, userPayload, sub);
    }
    dispatch(receiveUser(profile));
  } catch (error) {
    console.error(error);
    dispatch(cleanlyLogout());
  }
};

export const shouldFetchUser = (state: RootState) => !selectUser(state);

export const fetchUserFromJwtIfNeeded = (validDecodedJwt: DecodedJwt): ThunkActionUser => async (
  dispatch,
  getState,
) => {
  if (shouldFetchUser(getState())) {
    return dispatch(fetchUserFromJwt(validDecodedJwt));
  }
};

export const manageUserToken = (
  rawJwt: JwtToken,
  provider: Provider,
  callback?: () => Promise<void>,
): ThunkActionUser => async (dispatch, getState) => {
  let jwt: Nullable<JwtToken> = rawJwt;
  let decodedJwt: DecodedJwt = jwtDecode(rawJwt);

  if (isDecodedJwtExpired(decodedJwt)) {
    const provider = selectLoginProvider(getState());
    try {
      if (provider === Providers.google) {
        const refreshResponse = await googleRefreshToken();
        jwt = refreshResponse.data;
      } else if (provider === Providers.facebook) {
        const refreshResponse = await facebookRefreshToken();
        jwt = refreshResponse.data;
      } else if (provider === Providers.orcid) {
        //no attempt to automagically refresh orcid token
        jwt = null;
      }
    } catch (error) {
      console.error(error);
      await dispatch(revertAcceptedTermsThenLogoutCleanly());
      return;
    }
  }

  if (!jwt) {
    // no refresh token found.
    await dispatch(revertAcceptedTermsThenLogoutCleanly());
    return;
  }

  await dispatch(setTokenAndLoginProvider(jwt, provider));

  decodedJwt = jwtDecode(jwt);

  await dispatch(validateDecodedJwt(decodedJwt));
  await dispatch(fetchUserFromJwtIfNeeded(decodedJwt));
  if (callback) {
    await callback();
  }
};

export const manageUserTokenWithLoader = (
  jwt: JwtToken,
  provider: Provider,
  callback?: () => Promise<void>,
): ThunkActionUser => async (dispatch) => {
  dispatch(toggleIsLoadingUser(true));
  await dispatch(manageUserToken(jwt, provider, callback));
  dispatch(toggleIsLoadingUser(false));
};

export const updateUser = (user: User): ThunkActionUser => async (dispatch) => {
  try {
    const updatedProfile = await updateUserProfile({
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
    const updatedProfile = await updateUserProfile({
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
    await deleteUserProfile({
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
