import { logoutAll } from 'services/login';
import { updateProfile, getUserLoggedInProfile } from 'services/profiles';
import isEmpty from 'lodash/isEmpty';
import { removeForumBanner } from 'ForumBanner';

export const uiLogout = async ({
  loggedInUser,
  setUser,
  setToken,
  clearIntegrationTokens,
  api,
  history,
}) => {
  const isUserInMemory = loggedInUser && !isEmpty(loggedInUser);
  if (isUserInMemory) {
    const fetchedProfile = await getUserLoggedInProfile();
    const userExistsEndToEnd = !!fetchedProfile;
    // Make sure that the profile exists before updating it.
    if (userExistsEndToEnd) {
      await updateProfile(api)({
        user: {
          ...loggedInUser,
          acceptedTerms: false,
        },
      });
    }
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
      removeForumBanner();
      history.push('/');
    });
};
