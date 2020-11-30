import { userSnapApiKey } from '../../common/injectGlobals';

export const initUserSnap = () => {
  if (!userSnapApiKey) {
    return;
  }

  window.onUsersnapCXLoad = function (api) {
    api.init();
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://widget.usersnap.com/load/${userSnapApiKey}?onload=onUsersnapCXLoad`;
  document.head.append(script);
};
