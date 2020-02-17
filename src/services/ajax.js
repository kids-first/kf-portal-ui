import axios from 'axios';

let token;

const ajax = axios.create();

ajax.interceptors.request.use(
    config => {
        // set Authorization headers on a per request basis
        // setting headers on axios get/put/post or common seems to be shared accross all axios instances
        config.headers = {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...config.headers,
        };
        return config;
    },
    err => {
        return Promise.reject(err);
    },
);

export const setToken = t => (token = t);

export default ajax;