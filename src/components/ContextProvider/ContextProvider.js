import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { Router } from 'react-router';
import ScrollbarSizeProvider from './ScrollbarSizeProvider';
import { provideLoggedInUser, provideModalState, provideFenceConnections } from 'stateProviders';
import { initializeApi, ApiContext } from 'services/api';
import history, { HistoryContext } from 'services/history';
import { logoutAll } from 'services/login';
import { EGO_JWT_KEY } from 'common/constants';

export default compose(
  provideLoggedInUser,
  provideFenceConnections,
  provideModalState,
  injectState,
)(({ children }) => (
  <HistoryContext.Provider>
    <ApiContext.Provider
      value={initializeApi({
        onUnauthorized: () => {
          if (localStorage[EGO_JWT_KEY]) {
            localStorage.removeItem(EGO_JWT_KEY);
            logoutAll().then(() => {
              window.location.reload();
            });
          }
        },
      })}
    >
      <ScrollbarSizeProvider>
        <Router history={history}>{children}</Router>
      </ScrollbarSizeProvider>
    </ApiContext.Provider>
  </HistoryContext.Provider>
));
