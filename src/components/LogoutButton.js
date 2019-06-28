import * as React from 'react';
import { logoutAll } from 'services/login';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import { withApi } from 'services/api';

const enhance = compose(
  withRouter,
  injectState,
  withTheme,
  withApi,
);

export const uiLogout = ({ history, setUser, setToken, clearIntegrationTokens, api }) =>
  logoutAll()
    .then(() => {
      setUser({ api });
      setToken();
      clearIntegrationTokens();
      // we must wait so the freactal state propagates at least once or we will log back in Orcid
      return new Promise(r => setTimeout(r, 100));
    })
    .then(() => {
      history.push('/');
    });

const Logout = ({
  history,
  effects: { setToken, setUser, clearIntegrationTokens },
  theme,
  className,
  api,
}) => (
  <button
    css={`
      ${theme.button};
      ${className};
    `}
    onClick={() => uiLogout({ history, setToken, setUser, clearIntegrationTokens, api })}
  >
    <Trans>Logout</Trans>
  </button>
);

export default enhance(Logout);
