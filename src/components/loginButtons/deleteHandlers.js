import { deleteProfile } from 'services/profiles';
import urlJoin from 'url-join';
import { uiLogout } from 'components/LogoutButton';
import { shortUrlApi } from 'common/injectGlobals';

export const deleteAccount = async ({
  api,
  loggedInUser,
  setToken,
  setUser,
  clearIntegrationTokens,
  history,
}) => {
  await deleteProfile(api)({ user: loggedInUser, setUser });
  api({
    url: urlJoin(shortUrlApi, 'user', loggedInUser.egoId),
    method: 'GET',
  })
    .then(response =>
      Promise.all(
        response.map(({ id }) =>
          api({
            url: urlJoin(shortUrlApi, id),
            method: 'DELETE',
          }),
        ),
      ),
    )
    .then(() => {
      uiLogout({ history, setUser, setToken, clearIntegrationTokens, api });
    });
};
