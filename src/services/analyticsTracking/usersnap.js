//  ref https://help.usersnap.com/docs/developers-api-documentation#section-basics-for-usersnap-classic-widget
import { userSnapApiKey } from '../../common/injectGlobals';
import colors from 'style/themes/default/_colors.scss';

export const initUserSnap = () => {
  if (!userSnapApiKey) {
    return;
  }
  window.onUsersnapLoad = function (api) {
    api.init({
      colors: {
        primary: colors.btnPrimaryBg,
        secondary: '#AFFEEE',
      },
    });
    window.Usersnap = api;
  };
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://api.usersnap.com/load/${userSnapApiKey}.js?onload=onUsersnapLoad`;
  document.head.append(script);
};
