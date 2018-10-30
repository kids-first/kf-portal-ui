import axios from 'axios';
import urlJoin from 'url-join';

import { publicStatsApiRoot } from 'common/injectGlobals';

const ajax = axios.create();

ajax.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

export const initializeApi = () => ({
  onError = err => Promise.reject(err),
  method = 'get',
  endpoint = '',
  body,
  headers = {},
  url,
}) => {
  const uri = url || urlJoin(publicStatsApiRoot, endpoint);
  return ajax[method.toLowerCase()](uri, body, {
    headers: { 'Content-Type': 'application/json', ...headers },
  })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return onError(err);
    });
};

export const getBarChartData = api => async ({ field }) => {
  return await api({
    uri: 'field',
  });
};
