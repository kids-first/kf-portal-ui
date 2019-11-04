import urlJoin from 'url-join';
import ajax from 'services/ajax';
import { egoAppId, egoApiRoot } from 'common/injectGlobals';
import { EGO_JWT_KEY } from 'common/constants';
import { removeCookie } from './cookie';
import { store } from '../store';
import { logout } from '../store/actionCreators/user';
import { orcidLogout } from 'services/ego/auth';

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

export const logoutAll = () => {
  removeCookie(EGO_JWT_KEY);
  // discard the user/session details
  store.dispatch(logout());
  return Promise.all([googleLogout(), facebookLogout(), orcidLogout()]);
};
