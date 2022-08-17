import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import keycloak from 'auth/keycloak-api/keycloak';

const apiInstance = axios.create();

export interface ApiResponse<T> {
  data: T | undefined;
  response: AxiosResponse;
  error: AxiosError | undefined;
}

apiInstance.interceptors.request.use((config) => {
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
});

export const sendRequest = async <T,>(config: AxiosRequestConfig) => {
  return apiInstance
    .request<T>(config)
    .then(
      (response): ApiResponse<T> => ({
        response: response,
        data: response.data,
        error: undefined,
      }),
    )
    .catch(
      (err): ApiResponse<T> => ({
        response: err.response,
        data: undefined,
        error: err,
      }),
    );
};

export default apiInstance;
