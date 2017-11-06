import ajax from 'services/ajax';

const gapi = global.gapi;
gapi.load('auth2');

export const googleLogin = token =>
  ajax.get('/oauth/google/token', { headers: { id_token: token } });

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
  ajax.get('/oauth/facebook/token', { headers: { id_token: token } });

export const facebookLogout = () => {
  return new Promise((resolve, reject) => {
    global.FB.getLoginStatus(({ authResponse }) => {
      if (authResponse) {
        global.FB.logout(resolve);
      } else {
        resolve();
      }
    });
  });
};