import React from 'react';
import { Router } from 'react-router';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { EGO_JWT_KEY } from 'common/constants';
import { ApiContext, initializeApi } from 'services/api';
import history, { HistoryContext } from 'services/history';
import { logoutAll } from 'services/login';
import { provideFenceConnections, provideLoggedInUser } from 'stateProviders';

import ScrollbarSizeProvider from './ScrollbarSizeProvider';

export default compose(
  provideLoggedInUser,
  provideFenceConnections,
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
