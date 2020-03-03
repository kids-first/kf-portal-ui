import urlJoin from 'url-join';
import ajax from 'services/ajax';
import queryString from 'query-string';

import { egoAppId, egoApiRoot } from 'common/injectGlobals';
import { EGO_JWT_KEY, GOOGLE, FACEBOOK, ORCID } from 'common/constants';
import { removeCookie } from './cookie';
import { store } from '../store';
import { logout } from '../store/actionCreators/user';
import { orcidLogout } from 'services/ego/auth';
import googleSDK from 'services/googleSDK';
import facebookSDK from 'services/facebookSDK';

import {
  orcidAuthAppId,
  orcidAuthApiBaseUri,
  orcidAuthScope,
  orcidAuthRedirectUri,
} from 'common/injectGlobals';

const gapi = global.gapi;

export const refreshToken = async provider => {
  switch (provider) {
    case GOOGLE:
      return googleRefrestToken();
    case FACEBOOK:
      return facebookRefreshToken();
    case ORCID:
      return orcidRefreshToken();
    default:
      return null;
  }
};

export const googleLogin = token =>
  ajax.get(urlJoin(egoApiRoot, 'oauth/google/token'), {
    headers: { token },
    params: {
      client_id: egoAppId,
    },
  });

export const googleRefrestToken = async () => {
  return googleLogin((await googleReloadAuthResponse()).id_token);
};

export const googleReloadAuthResponse = async () => {
  if (!(global.gapi && global.gapi.auth2)) {
    await googleSDK();
  }
  const instance = global.gapi.auth2.getAuthInstance();
  return instance.currentUser.get().reloadAuthResponse();
};

const wait = s => new Promise(r => setTimeout(r, s * 1000));

export const googleLogout = () => {
  const authInstance = gapi.auth2.getAuthInstance();
  return authInstance ? authInstance.signOut() : Promise.resolve();
};

export const facebookLogin = token =>
  ajax.get(urlJoin(egoApiRoot, '/oauth/facebook/token'), {
    headers: { token },
    params: {
      client_id: egoAppId,
    },
  });

export const facebookRefreshToken = async () =>
  facebookLogin((await facebookStatus()).authResponse.accessToken);

export const facebookStatus = async () => {
  if (!global.FB) {
    await facebookSDK();
  }
  return new Promise((resolve, reject) => {
    try {
      global.FB.getLoginStatus(response => {
        resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const facebookLogout = () =>
  Promise.race([
    new Promise((resolve, reject) => {
      try {
        global.FB.getLoginStatus(response =>
          response.authResponse ? global.FB.logout(r => resolve(r)) : resolve(),
        );
      } catch (err) {
        console.warn('failed to get fb login status: ', err);
        resolve();
      }
    }),
    wait(2),
  ]);

export const orcidRefreshToken = () => {
  // redirect to Orcid OAuth flow
  const search = queryString.stringify({
    client_id: orcidAuthAppId,
    response_type: 'code',
    scope: orcidAuthScope,
    redirect_uri: urlJoin(window.location.origin, orcidAuthRedirectUri),
  });
  const url = urlJoin(orcidAuthApiBaseUri, `/oauth/authorize?${search}`);
  window.location = url;
  return Promise.resolve({
    type: 'redirect',
  });
};

export const logoutAll = () => {
  removeCookie(EGO_JWT_KEY);
  // discard the user/session details
  store.dispatch(logout());
  return Promise.all([googleLogout(), facebookLogout(), orcidLogout()]);
};
