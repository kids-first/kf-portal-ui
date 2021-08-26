import axios from 'axios';

import keycloak from '../keycloak';

const ajax = axios.create();

ajax.interceptors.request.use(
  (config) => {
    // set Authorization headers on a per request basis
    // setting headers on axios get/put/post or common seems to be shared across all axios instances

    const token = keycloak?.token;
    if (token) {
      config.headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      };
    }

    return config;
  },
  (err) => Promise.reject(err),
);

export default ajax;
