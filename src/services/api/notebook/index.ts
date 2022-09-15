import EnvironmentVariables from 'helpers/EnvVariables';
import { sendRequest } from 'services/api';
import { TNotebookApiResponse } from './model';

export const NOTEBOOK_API_URL = `${EnvironmentVariables.configFor('VARIANT_CLUSTER_API')}`;

const start = () => {
  return sendRequest<TNotebookApiResponse>({
    method: 'POST',
    url: NOTEBOOK_API_URL,
  });
};

const get = () => {
  return sendRequest<any>({
    method: 'GET',
    url: NOTEBOOK_API_URL,
  });
};

const stop = () =>
  sendRequest<void>({
    method: 'DELETE',
    url: NOTEBOOK_API_URL,
  });

export const NotebookApi = {
  start,
  get,
  stop,
};
