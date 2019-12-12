import { logoutAll } from 'services/login';

export const uiLogout = ({ setUser, setToken, clearIntegrationTokens, api }) => {
  return logoutAll().then(() => {
    setUser({ api });
    setToken();
    clearIntegrationTokens();
    // we must wait so the freactal state propagates at least once or we will log back in Orcid
    return new Promise(r => setTimeout(r, 100));
  });
};
