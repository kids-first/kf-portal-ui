import EnvVariables from "helpers/EnvVariables";

declare global {
  interface Window {
    onUsersnapCXLoad: (api: any) => void;
  }
}

export const initUserSnap = () => {
  const apiKey = EnvVariables.configFor("USER_SNAP_API_KEY");

  if (!apiKey) {
    return;
  }

  window.onUsersnapCXLoad = (api) => {
    api.init();
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://widget.usersnap.com/load/${apiKey}?onload=onUsersnapCXLoad`;
  document.head.append(script);
};
