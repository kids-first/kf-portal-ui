import ajax from 'services/ajax';

const gapi = global.gapi;
gapi.load('auth2');

export const googleLogin = token =>
  ajax.get('/oauth/google/token', {
    headers: { token: token },
    params: {
      client_id: process.env.REACT_APP_EGO_APP_ID,
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
  ajax.get('/oauth/facebook/token', {
    headers: { token: token },
    params: {
      client_id: process.env.REACT_APP_EGO_APP_ID,
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
