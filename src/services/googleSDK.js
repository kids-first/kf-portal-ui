import { googleAppId } from 'common/injectGlobals';

const googleSDK = () => {
  console.log('GOOGLE SDK INIT');
  return new Promise((resolve, reject) => {
    const gapi = global.gapi;
    gapi.load('auth2', () => {
      gapi.auth2
        .init({ client_id: googleAppId })
        .then(x => resolve(x))
        .catch(err => reject(err));
    });
  });
};

export default googleSDK;
