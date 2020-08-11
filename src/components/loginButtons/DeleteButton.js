import React, { useState } from 'react';
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
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
      <Button
        loading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await deleteAccount({
            api,
            loggedInUser,
            setToken,
            setUser,
            clearIntegrationTokens,
            history,
          });
          if (onClickCB) {
            await onClickCB();
          }
          setIsLoading(false);
        }}
      >
        {label}
      </Button>
    );
  },
);
