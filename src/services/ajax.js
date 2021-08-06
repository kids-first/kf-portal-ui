import axios from 'axios';

import { store } from 'store';

import { selectUserToken } from '../store/selectors/users';

const ajax = axios.create();

ajax.interceptors.request.use(
  (config) => {
    // set Authorization headers on a per request basis
    // setting headers on axios get/put/post or common seems to be shared accross all axios instances
    const token = selectUserToken(store.getState());
    config.headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config.headers,
    };
    return config;
  },
  (err) => Promise.reject(err),
);

export default ajax;
