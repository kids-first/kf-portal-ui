import scriptjs from 'scriptjs';

import { facebookAppId } from 'common/injectGlobals';

const facebookSDK = () =>
  new Promise((resolve, reject) =>
    scriptjs(`https://connect.facebook.net/en_US/sdk.js`, () => {
      global.FB.init({
        appId: facebookAppId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.10',
      });
      resolve(global.FB);
    }),
  );

export default facebookSDK;
