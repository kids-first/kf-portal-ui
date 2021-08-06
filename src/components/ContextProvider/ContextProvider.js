import React from 'react';
import { Router } from 'react-router';

import { EGO_JWT_KEY } from 'common/constants';
import { ApiContext, initializeApi } from 'services/api';
import history, { HistoryContext } from 'services/history';
import { store } from 'store';

import { revertAcceptedTermsThenLogoutCleanly } from '../../store/actionCreators/user';

import ScrollbarSizeProvider from './ScrollbarSizeProvider';

// eslint-disable-next-line react/display-name
export default ({ children }) => (
  <HistoryContext.Provider>
    <ApiContext.Provider
      value={initializeApi({
        onUnauthorized: async () => {
          if (localStorage[EGO_JWT_KEY]) {
            await store.dispatch(revertAcceptedTermsThenLogoutCleanly());
            window.location.reload();
          }
        },
      })}
    >
      <ScrollbarSizeProvider>
        <Router history={history}>{children}</Router>
      </ScrollbarSizeProvider>
    </ApiContext.Provider>
  </HistoryContext.Provider>
);
