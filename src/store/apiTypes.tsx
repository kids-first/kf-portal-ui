export type ApiConfig = {
  method: string;
  endpoint?: string;
  body?: unknown;
  headers?: unknown;
  url?: string;
  arrangerRoot?: string;
};

export type ApiFunction = (config: ApiConfig) => Promise<any>; // any because it could be a lot of different type depending on which call is done.

export type Api = {
  api: ApiFunction;
};
