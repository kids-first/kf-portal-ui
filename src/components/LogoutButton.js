import * as React from 'react';
import { logoutAll } from 'services/login';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

const wait = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const enhance = compose(withRouter, injectState, withTheme);

export const uiLogout = ({ history, setUser, setToken }) =>
  Promise.race([logoutAll(), wait(2)]).then(() => {
    setUser(null);
    setToken(null);
    history.push('/');
  });

const Logout = ({ history, effects: { setToken, setUser }, theme }) => (
  <button className={theme.button} onClick={() => uiLogout({ history, setToken, setUser })}>
    Logout
  </button>
);

export default enhance(Logout);
