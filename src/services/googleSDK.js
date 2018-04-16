import { googleAppId } from 'common/injectGlobals';

const googleSDK = () => {
  return new Promise((resolve, reject) => {
    const gapi = global.gapi;
    gapi.load('auth2', () => {
      gapi.auth2.init({ client_id: googleAppId }).then(x => resolve(x));
    });
  });
};

export default googleSDK;
