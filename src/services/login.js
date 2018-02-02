import urlJoin from 'url-join';

import ajax from 'services/ajax';
import { egoAppId, egoApiRoot } from 'common/injectGlobals';

const gapi = global.gapi;
//gapi.load('auth2');

export const googleLogin = token =>
  ajax.get(urlJoin(egoApiRoot, 'oauth/google/token'), {
    headers: { token },
    params: {
      client_id: egoAppId,
    },
  });

export const googleLogout = () => {
  const authInstance = gapi.auth2.getAuthInstance();
  if (authInstance) {
    return authInstance.signOut();
  } else {
    // already signed out
    return Promise.resolve();
  }
};

export const facebookLogin = token =>
  ajax.get(urlJoin(egoApiRoot, '/oauth/facebook/token'), {
    headers: { token },
    params: {
      client_id: egoAppId,
    },
  });

export const facebookLogout = () => {
  return new Promise((resolve, reject) => {
    global.FB.getLoginStatus(response => {
      if (response.authResponse) {
        global.FB.logout(r => resolve(r));
      } else {
        resolve();
      }
    });
  });
};

export const logoutAll = () => Promise.all([googleLogout(), facebookLogout()]);
