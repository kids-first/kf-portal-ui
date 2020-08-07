import { logoutAll } from 'services/login';
import { updateProfile } from 'services/profiles';

export const uiLogout = async ({
  loggedInUser,
  setUser,
  setToken,
  clearIntegrationTokens,
  api,
  history,
}) => {
  if (loggedInUser) {
    await updateProfile(api)({
      user: {
        ...loggedInUser,
        acceptedTerms: false,
      },
    });
  }
  return logoutAll()
    .then(() => {
      setUser({ api });
      setToken();
      clearIntegrationTokens();
      // we must wait so the freactal state propagates at least once or we will log back in Orcid
      return new Promise((r) => setTimeout(r, 100));
    })
    .then(() => {
      history.push('/');
    });
};
