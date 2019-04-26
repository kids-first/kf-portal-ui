import { facebookAppId } from 'common/injectGlobals';

const facebookSDK = () =>
  new Promise((resolve, reject) => {
    const fbapi = global.FB;

    if (!fbapi) {
      reject({ details: 'Facebook API not defined' });
      return;
    }

    fbapi.init({
      appId: facebookAppId,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v2.10',
    });

    resolve(fbapi);
  });

export default facebookSDK;
