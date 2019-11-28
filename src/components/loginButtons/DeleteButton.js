import React from 'react';
import { withRouter } from 'react-router-dom';
import { deleteProfile } from 'services/profiles';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { uiLogout } from 'components/LogoutButton';
import { shortUrlApi } from 'common/injectGlobals';
import urlJoin from 'url-join';
import { withApi } from 'services/api';

export default compose(
  injectState,
  withRouter,
  withApi,
)(
  ({
    history,
    state: { loggedInUser },
    effects: { setToken, setUser, clearIntegrationTokens },
    className,
    children,
    api,
    ...props
  }) => (
    <button
      className={className}
      onClick={async () => {
        await deleteProfile(api)({ user: loggedInUser });

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
          .then(() => uiLogout({ setUser, setToken, clearIntegrationTokens, api }))
          .then(() => {
            history.push('/');
          });
      }}
      {...props}
    >
      {children}
    </button>
  ),
);
