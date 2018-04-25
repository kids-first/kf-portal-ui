import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { ThemeProvider } from 'emotion-theming';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from 'theme/defaultTheme';
import { provideLoggedInUser, provideModalState, provideToast } from 'stateProviders';

export default compose(provideLoggedInUser, provideModalState, provideToast, injectState)(
  ({ children }) => (
    <Router >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Router>
  ),
);

