import React from 'react';
import { withRouter } from 'react-router-dom';
import { deleteProfile } from 'services/profiles';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { uiLogout } from 'components/LogoutButton';
import { shortUrlApi } from 'common/injectGlobals';
import urlJoin from 'url-join';

export default compose(injectState, withRouter)(
  ({
    history,
    state: { loggedInUser },
    effects: { setToken, setUser, clearIntegrationTokens },
    className,
    children,
    ...props
  }) => (
    <button
      className={className}
      onClick={async () => {
        await deleteProfile({ user: loggedInUser });

        let response = await fetch(urlJoin(shortUrlApi, 'user', loggedInUser.egoId)).then(r =>
          r.json(),
        );

        response.value.forEach(async ({ id }) => {
          await fetch(urlJoin(shortUrlApi, id), {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json',
            },
          });
        });

        uiLogout({ history, setUser, setToken, clearIntegrationTokens });
      }}
      {...props}
    >
      {children}
    </button>
  ),
);
