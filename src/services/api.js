import React from 'react';
import { arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import ajax from './ajax';

export const initializeApi = ({ onUnauthorized }) => async ({
  method = 'post',
  endpoint = '',
  body,
  headers,
  url,
}) => {
  const uri = url || urlJoin(arrangerApiRoot, endpoint);
  return ajax[method.toLowerCase()](uri, body)
    .then(response => {
      return response.data;
    })
    .catch(({ response }) => {
      if (response.status === 401) {
        return onUnauthorized(response);
      }
    });
};

export const ApiContext = React.createContext(null);

export const withApi = WrappedComponent => props => (
  <ApiContext.Consumer>{api => <WrappedComponent {...{ api, ...props }} />}</ApiContext.Consumer>
);
