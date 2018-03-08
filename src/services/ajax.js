import axios from 'axios';
import { gen3ApiRoot } from 'common/injectGlobals';

let token;
let gen3Token;

const ajax = axios.create();

ajax.interceptors.request.use((config) => {
  // set Authorization headers on a per request basis
  // setting headers on axios get/put/post or common seems to be shared accross all axios instances
  config.headers["Authorization"] = `Bearer ${config.url.startsWith(gen3ApiRoot) ? gen3Token : token}`;
  return config;
}, (err) => {
  return Promise.reject(err);
});

export const getToken = () => token;

export const setToken = t => {
  token = t;
};

export const setGen3Token = t => {
  gen3Token = t;
};

export default ajax;
