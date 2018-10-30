import axios from 'axios';

import { publicStatsApiRoot } from 'common/injectGlobals';

export const initializeApi = ({ baseURL = '' }) => {
  const url = baseURL || publicStatsApiRoot;
  const ajax = axios.create({
    baseURL: url,
  });
  return ajax;
};
