import EnvironmentVariables from 'helpers/EnvVariables';

import { sendRequest } from 'services/api';

import { TNotebookApiResponse } from './model';

export const NOTEBOOK_API_URL = `${EnvironmentVariables.configFor('VWB_CAVATICA_API')}`;

const getManifest = () =>
  sendRequest<TNotebookApiResponse>({
    method: 'GET',
    url: `${NOTEBOOK_API_URL}/vwb/manifest`,
  });

const getStatus = () =>
  sendRequest<TNotebookApiResponse>({
    method: 'GET',
    url: `${NOTEBOOK_API_URL}/status`,
  });

const stop = () =>
  sendRequest<void>({
    method: 'DELETE',
    url: NOTEBOOK_API_URL,
  });

export const NotebookApi = {
  getManifest,
  getStatus,
  stop,
};
