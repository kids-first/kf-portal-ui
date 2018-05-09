import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { ThemeProvider } from 'emotion-theming';
import { Router } from 'react-router';
import theme from 'theme/defaultTheme';
import { provideLoggedInUser, provideModalState, provideToast } from 'stateProviders';
import { initializeApi, ApiContext } from 'services/api';
import history from 'services/history';

export default compose(provideLoggedInUser, provideModalState, provideToast, injectState)(
  ({ children, state, effects }) => (
    <ApiContext.Provider
      value={initializeApi({
        onUnauthorized: response => {
          window.location.reload();
        },
      })}
    >
      <Router history={history}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Router>
    </ApiContext.Provider>
  ),
);
