/* eslint-disable no-undef */
import queryString from 'query-string';
import urlJoin from 'url-join';

import {
  egoApiRoot,
  egoAppId,
  orcidAuthApiBaseUri,
  orcidAuthAppId,
  orcidAuthRedirectUri,
  orcidAuthScope,
} from 'common/injectGlobals';
import ajax from 'services/ajax';
import facebookSDK from 'services/facebookSDK';
import googleSDK from 'services/googleSDK';

const gapi = global.gapi;

export const googleLogin = (token) =>
  ajax.get(urlJoin(egoApiRoot, 'oauth/google/token'), {
    headers: { token },
    params: {
      client_id: egoAppId,
    },
  });

export const googleRefreshToken = async () => {
  const reloadResponse = await googleReloadAuthResponse();
  const token = reloadResponse.id_token;
  return googleLogin(token);
};

export const googleReloadAuthResponse = async () => {
  if (!(global.gapi && global.gapi.auth2)) {
    await googleSDK();
  }
  const instance = global.gapi.auth2.getAuthInstance();
  return instance.currentUser.get().reloadAuthResponse();
};

const wait = (s) => new Promise((r) => setTimeout(r, s * 1000));

export const googleLogout = () => {
  const authInstance = gapi.auth2.getAuthInstance();
  return authInstance ? authInstance.signOut() : Promise.resolve();
};

export const facebookLogin = (token) =>
  ajax.get(urlJoin(egoApiRoot, '/oauth/facebook/token'), {
    headers: { token },
    params: {
      client_id: egoAppId,
    },
  });

export const facebookRefreshToken = async () => {
  const fbResponseStatus = await facebookStatus();
  const token = fbResponseStatus.authResponse.accessToken;
  return facebookLogin(token);
};

export const facebookStatus = async () => {
  if (!global.FB) {
    await facebookSDK();
  }
  return new Promise((resolve, reject) => {
    try {
      global.FB.getLoginStatus((response) => {
        resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const facebookLogout = () =>
  Promise.race([
    new Promise((resolve) => {
      try {
        global.FB.getLoginStatus((response) =>
          response.authResponse ? global.FB.logout((r) => resolve(r)) : resolve(),
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

  window.location = urlJoin(orcidAuthApiBaseUri, `/oauth/authorize?${search}`);
  return Promise.resolve({
    type: 'redirect',
  });
};
