import { removeForumBanner } from 'ForumBanner';
import isEmpty from 'lodash/isEmpty';

import ROUTES from 'common/routes';
import { logoutAll } from 'services/login';
import { getUserLoggedInProfile, updateProfile } from 'services/profiles';

export const uiLogout = async ({
  loggedInUser,
  setUser,
  setToken,
  clearIntegrationTokens,
  api,
  history,
  setIsLoadingUser = null,
}) => {
  if (setIsLoadingUser) {
    setIsLoadingUser(true);
  }

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
      history.push(ROUTES.login);
    });
};
