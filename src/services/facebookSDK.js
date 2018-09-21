import { facebookAppId } from 'common/injectGlobals';

const facebookSDK = () =>
  new Promise((resolve, reject) => {
    const fbapi = global.FB;
    console.log('fbapi', fbapi, global);
    if (!fbapi) {
      console.log('CIARAN FB API NOT DEFINED');
      reject({ details: 'Facebook API not defined' });
      return;
    }

    global.FB.init({
      appId: facebookAppId,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v2.10',
    });

    resolve(global.FB);
  });

export default facebookSDK;
