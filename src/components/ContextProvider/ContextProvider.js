import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { ThemeProvider } from 'emotion-theming';
// [NEXT] Hot Reload: not sure if this is necessary in this version of CRA
// import { AppContainer } from 'react-hot-loader';
import { Router } from 'react-router';
import ScrollbarSizeProvider from './ScrollbarSizeProvider';
import theme from 'theme/defaultTheme';
import {
  provideLoggedInUser,
  provideModalState,
  provideToast,
  provideFenceConnections,
} from 'stateProviders';
import { initializeApi, ApiContext } from 'services/api';
import history, { HistoryContext } from 'services/history';
import { logoutAll } from 'services/login';
import { EGO_JWT_KEY } from 'common/constants';

export default compose(
  provideLoggedInUser,
  provideFenceConnections,
  provideModalState,
  provideToast,
  injectState,
)(({ children, state, effects }) => (
  <HistoryContext.Provider>
    <ApiContext.Provider
      value={initializeApi({
        onUnauthorized: response => {
          if (localStorage[EGO_JWT_KEY]) {
            localStorage.removeItem(EGO_JWT_KEY);
            logoutAll().then(() => {
              window.location.reload();
            });
          }
        },
      })}
    >
      <ThemeProvider theme={theme}>
        <ScrollbarSizeProvider>
          {
            // [NEXT] Hot Reload: not sure if this is necessary in this version of CRA
            /* <AppContainer> */
          }
          <Router history={history}>{children}</Router>
          {/* </AppContainer> */}
        </ScrollbarSizeProvider>
      </ThemeProvider>
    </ApiContext.Provider>
  </HistoryContext.Provider>
));
