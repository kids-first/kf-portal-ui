import React from 'react';
import { arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import ajax from './ajax';

export const initializeApi = ({ onError = () => {}, onUnauthorized = () => {} } = {}) => ({
  method = 'post',
  endpoint = '',
  body,
  headers = {},
  url,
}) => {
  const uri = url || urlJoin(arrangerApiRoot, endpoint);
  return ajax[method.toLowerCase()](uri, body, {
    headers: { 'Content-Type': 'application/json', ...headers },
  })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      const { response } = err;
      if ((response || {}).status === 401) {
        return onUnauthorized(response);
      }
      onError(err);
    });
};

export const ApiContext = React.createContext(null);

export const withApi = WrappedComponent => props => (
  <ApiContext.Consumer>{api => <WrappedComponent {...{ api, ...props }} />}</ApiContext.Consumer>
);
