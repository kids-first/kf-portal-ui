import axios from 'axios';
import { apiRoot } from 'common/injectGlobals';

let token;

const ajax = axios.create({ baseURL: apiRoot });

export const getToken = () => token;

export const setToken = t => {
  token = t;
  ajax.defaults.headers.common.Authorization = t;
};

export default ajax;
