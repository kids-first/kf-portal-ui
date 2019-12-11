import React from 'react';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { withApi } from 'services/api';
import { deleteAccount } from './deleteHandlers';

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
        await deleteAccount({
          api,
          loggedInUser,
          setToken,
          setUser,
          clearIntegrationTokens,
          history,
        });
      }}
      {...props}
    >
      {children}
    </button>
  ),
);
