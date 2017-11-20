import axios from 'axios';

let token;

const ajax = axios.create();

export const getToken = () => token;

export const setToken = t => {
  token = t;
  ajax.defaults.headers.common.authorization = `Bearer ${t}`;
};

export default ajax;
