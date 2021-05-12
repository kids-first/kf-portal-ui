import React from 'react';
import urlJoin from 'url-join';

import { arrangerApiRoot } from 'common/injectGlobals';

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
  return sendRequest(defaultHeaders, method, body, headers, uri)
    .then((response) => response.data)
    .catch((err) => {
      const { response } = err;
      if ((response || {}).status === 401) {
        return onUnauthorized(response);
      }
      return onError(err);
    });
};

const sendRequest = (defaultHeaders, method, body, headers, uri) => {
  switch (method.toLowerCase()) {
    case 'post':
    case 'put':
    case 'patch':
      return ajax[method.toLowerCase()](uri, body, {
        headers: {
          'Content-Type': 'application/json',
          ...(defaultHeaders || {}),
          ...headers,
        },
      });
    case 'delete':
    case 'get':
    case 'head':
    case 'options':
      return ajax[method.toLowerCase()](uri, {
        headers: {
          'Content-Type': 'application/json',
          ...(defaultHeaders || {}),
          ...headers,
        },
        data: body,
      });
  }
};

export const ApiContext = React.createContext(null);

export const withApi = (WrappedComponent) => (props) => (
  <ApiContext.Consumer>{(api) => <WrappedComponent {...{ api, ...props }} />}</ApiContext.Consumer>
);

export const apiInitialized = initializeApi({
  onError: (err) => console.error(err),
  onUnauthorized: (response) => {
    console.warn('Unauthorized', response);
  },
});
