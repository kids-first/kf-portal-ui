import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type Api = {
  api: (config: AxiosRequestConfig) => Promise<AxiosResponse>;
};
