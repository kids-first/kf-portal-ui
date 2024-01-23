import EnvVariables from 'helpers/EnvVariables';

declare global {
  interface Window {
    onUsersnapCXLoad: (api: any) => void;
  }
}

export const initUserSnap = () => {
  const apiKey = EnvVariables.configFor('USER_SNAP_API_KEY');

  if (!apiKey) {
    return;
  }

  window.onUsersnapCXLoad = (api) => {
    api.init();
  };

  fetch(`https://widget.usersnap.com/load/${apiKey}?onload=onUsersnapCXLoad`, {
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
  })
    .then(() => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://widget.usersnap.com/load/${apiKey}?onload=onUsersnapCXLoad`;
      document.head.append(script);
    })
    .catch((error: any) => {
      console.log(error.message);
    });
};
