import * as React from 'react';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const withHistory = WrappedComponent => props => (
  <WrappedComponent {...{ history, ...props }} />
);

export const HistoryContext = React.createContext(history);

export default history;
