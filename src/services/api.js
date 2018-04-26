import React from 'react';
import { arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import ajax from './ajax';

export const initializeApi = ({ onUnauthorized, onData }) => async ({
  method = 'post',
  endpoint = '',
  body,
  headers,
  url,
}) => {
  const uri = url || urlJoin(arrangerApiRoot, endpoint);

  return ajax[method.toLowerCase()](uri, body)
    .then(response => {
      // console.log('response: ', response);
      console.log(onData);
      if (onData) {
        console.log('onData exists');
        onData(response);
      }
      return response.data;
    })
    .catch(({ response }) => {
      // console.log('error response: ', response);
      if (response.status === 401) {
        return onUnauthorized(response);
      }
    });
};

const api = initializeApi({
  onUnauthorized: response => {
    window.location.reload();
  },
});

export const ApiContext = React.createContext(api);

export default api;
