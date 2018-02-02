import * as React from 'react';
import { logoutAll } from 'services/login';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

const wait = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const enhance = compose(withRouter, injectState, withTheme);

const Logout = ({ history, effects: { setUser }, theme }) => (
  <button
    className={theme.button}
    onClick={() =>
      Promise.race([logoutAll(), wait(2)]).then(() => {
        setUser(null);
        history.push('/');
      })
    }
  >
    Logout
  </button>
);

export default enhance(Logout);
