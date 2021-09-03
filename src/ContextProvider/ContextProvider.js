import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router';
import KeycloakProvider from 'ContextProvider/Keycloak';
import ScrollbarSizeProvider from 'ContextProvider/ScrollbarSizeProvider';

import { ApiContext, initializeApi } from 'services/api';
import { onUnauthorizedUser } from 'services/api';
import history, { HistoryContext } from 'services/history';

import { getPreloadedState, initStore } from '../store';
// eslint-disable-next-line react/display-name
export default ({ children }) => {
  const preloadedState = getPreloadedState();
  const store = initStore(preloadedState);

  return (
    <KeycloakProvider>
      <HistoryContext.Provider>
        <ApiContext.Provider
          value={initializeApi({
            onUnauthorized: onUnauthorizedUser,
          })}
        >
          <ReduxProvider store={store}>
            <ScrollbarSizeProvider>
              <Router history={history}>{children}</Router>
            </ScrollbarSizeProvider>
          </ReduxProvider>
        </ApiContext.Provider>
      </HistoryContext.Provider>
    </KeycloakProvider>
  );
};
