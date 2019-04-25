import { googleAppId } from 'common/injectGlobals';

const googleSDK = () => {
  return new Promise((resolve, reject) => {
    const gapi = global.gapi;

    if (!gapi) {
      reject({ details: 'Google API not defined' });
      return;
    }

    gapi.load('auth2', () => {
      gapi.auth2
        .init({ client_id: googleAppId })
        .then(x => resolve(x))
        .catch(err => reject(err));
    });
  });
};

export default googleSDK;
