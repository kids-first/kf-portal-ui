import { facebookAppId } from 'common/injectGlobals';

export default new Promise((resolve, reject) => {
  global.fbAsyncInit = function() {
    global.FB.init({
      appId: facebookAppId,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v2.10',
    });
    resolve(global.FB);
  };

  (function(d: any, s: any, id: any) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
});
