import { AxiosResponse } from 'axios';

export type ApiConfig = {
  method: string;
  endpoint?: string;
  body?: unknown;
  headers?: unknown;
  url?: string;
  arrangerRoot?: string;
};

export type Api = {
  api: (config: ApiConfig) => Promise<AxiosResponse>;
};
