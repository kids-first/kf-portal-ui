import React from 'react';
import { arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import ajax from './ajax';

export const initializeApi = ({
  onError = (err) => Promise.reject(err),
  onUnauthorized = () => {},
  defaultHeaders,
} = {}) => ({
  method = 'post',
  endpoint = '',
  body,
  headers = {},
  url,
  arrangerRoot = arrangerApiRoot,
}) => {
  const uri = url || urlJoin(arrangerRoot, endpoint);
  return ajax[method.toLowerCase()](uri, body, {
    headers: {
      'Content-Type': 'application/json',
      ...(defaultHeaders || {}),
      ...headers,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      const { response } = err;
      if ((response || {}).status === 401) {
        return onUnauthorized(response);
      }
      return onError(err);
    });
};

export const ApiContext = React.createContext(null);

export const withApi = (WrappedComponent) => (props) => (
  <ApiContext.Consumer>{(api) => <WrappedComponent {...{ api, ...props }} />}</ApiContext.Consumer>
);

export const apiInitialized = initializeApi({
  onError: console.err,
  onUnauthorized: (response) => {
    console.warn('Unauthorized', response);
  },
});
