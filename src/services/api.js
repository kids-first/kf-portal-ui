import React from 'react';
import urlJoin from 'url-join';

import { arrangerApiRoot } from 'common/injectGlobals';
import ajax from 'services/ajax';
import { store } from 'store';
import { cleanlyLogout } from 'store/actionCreators/user';

const sendRequest = (defaultHeaders, method, body, headers, uri) => {
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(defaultHeaders || {}),
    ...headers,
  };
  switch (method) {
    case 'delete':
    case 'get':
    case 'head':
    case 'options':
      return ajax[method](uri, {
        headers: requestHeaders,
        data: body,
      });
    default:
      return ajax[method](uri, body, {
        headers: requestHeaders,
      });
  }
};

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
  const methodLowerCase = (method || '').toLowerCase();
  return sendRequest(defaultHeaders, methodLowerCase, body, headers, uri)
    .then((response) => response.data)
    .catch((err) => {
      const { response } = err;
      if ((response || {}).status === 401) {
        console.warn('Unauthorized', response);
        return onUnauthorized(response);
      }
      return onError(err);
    });
};

export const ApiContext = React.createContext(null);

export const withApi = (WrappedComponent) => (props) => (
  <ApiContext.Consumer>{(api) => <WrappedComponent {...{ api, ...props }} />}</ApiContext.Consumer>
);

export const onUnauthorizedUser = async () => {
  await store.dispatch(cleanlyLogout());
};

export const apiUser = initializeApi({
  onError: (err) => console.error(err),
  onUnauthorized: onUnauthorizedUser,
});
