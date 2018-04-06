import * as React from 'react';
import { logoutAll } from 'services/login';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

const wait = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const enhance = compose(withRouter, injectState, withTheme);

export const uiLogout = ({ history, setUser, setToken, clearIntegrationTokens }) =>
  Promise.race([logoutAll(), wait(2)]).then(() => {
    setUser(null);
    setToken(null);
    clearIntegrationTokens();
    history.push('/');
  });

const Logout = ({
  history,
  effects: { setToken, setUser, clearIntegrationTokens },
  theme,
  className,
}) => (
  <button
    css={`
      ${theme.button};
      ${className};
    `}
    onClick={() => uiLogout({ history, setToken, setUser, clearIntegrationTokens })}
  >
    <Trans>Logout</Trans>
  </button>
);

export default enhance(Logout);
