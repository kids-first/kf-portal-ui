import urlJoin from 'url-join';
import ajax from 'services/ajax';
import { egoAppId, egoApiRoot } from 'common/injectGlobals';
import { EGO_JWT_KEY } from 'common/constants';
import {removeCookie} from './cookie';

const gapi = global.gapi;

export const googleLogin = token =>
  ajax.get(urlJoin(egoApiRoot, 'oauth/google/token'), {
    headers: { token },
    params: {
      client_id: egoAppId,
    },
  });

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

export const facebookLogout = () =>
  Promise.race([
    new Promise((resolve, reject) =>
      global.FB.getLoginStatus(
        response => (response.authResponse ? global.FB.logout(r => resolve(r)) : resolve()),
      ),
    ),
    wait(2),
  ]);

export const logoutAll = () => {
  removeCookie(EGO_JWT_KEY)
  return Promise.all([googleLogout(), facebookLogout()])
};
