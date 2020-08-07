import React from 'react';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { withApi } from 'services/api';
import { deleteAccount } from './deleteHandlers';
import { Button } from 'antd';

export default compose(
  injectState,
  withRouter,
  withApi,
)(
  ({
    history,
    state: { loggedInUser },
    effects: { setToken, setUser, clearIntegrationTokens },
    api,
    label = 'Cancel',
    onClickCB,
  }) => (
    <Button
      onClick={async () => {
        onClickCB && (await onClickCB());
        await deleteAccount({
          api,
          loggedInUser,
          setToken,
          setUser,
          clearIntegrationTokens,
          history,
        });
      }}
    >
      {label}
    </Button>
  ),
);
