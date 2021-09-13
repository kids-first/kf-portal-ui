import React from 'react';
import { Router } from 'react-router';

import { ApiContext, initializeApi } from 'services/api';
import { onUnauthorizedWhenTokenInLs } from 'services/api';
import history, { HistoryContext } from 'services/history';

import ScrollbarSizeProvider from './ScrollbarSizeProvider';

// eslint-disable-next-line react/display-name
export default ({ children }) => (
  <HistoryContext.Provider>
    <ApiContext.Provider
      value={initializeApi({
        onUnauthorized: onUnauthorizedWhenTokenInLs,
      })}
    >
      <ScrollbarSizeProvider>
        <Router history={history}>{children}</Router>
      </ScrollbarSizeProvider>
    </ApiContext.Provider>
  </HistoryContext.Provider>
);
