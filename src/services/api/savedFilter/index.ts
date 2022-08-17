import EnvironmentVariables from 'helpers/EnvVariables';
import { TUserSavedFilter, TUserSavedFilterInsert, TUserSavedFilterUpdate } from './models';
import { sendRequest } from 'services/api';
import { Mock_SavedFilter } from '../mock';

export const SAVED_FILTER_API_URL = `${EnvironmentVariables.configFor('USERS_API')}/saved-filters`;

const headers = () => ({
  'Content-Type': 'application/json',
});

const fetchAll = (tag?: string) => Mock_SavedFilter.fetchAll(headers, tag);
// const fetchAll = (tag?: string) =>
//   sendRequest<TUserSavedFilter[]>({
//     method: 'GET',
//     url: `${SAVED_FILTER_API_URL}${tag ? '/tag/' + tag : ''}`,
//     headers: headers(),
//   });

const fetchById = (id: string) =>
  sendRequest<TUserSavedFilter>({
    method: 'GET',
    url: `${SAVED_FILTER_API_URL}/${id}`,
    headers: headers(),
  });

const create = (body: TUserSavedFilterInsert) =>
  sendRequest<TUserSavedFilter>({
    method: 'POST',
    url: SAVED_FILTER_API_URL,
    headers: headers(),
    data: body,
  });

const update = (id: string, body: TUserSavedFilterUpdate) =>
  sendRequest<TUserSavedFilter>({
    method: 'PUT',
    url: `${SAVED_FILTER_API_URL}/${id}`,
    headers: headers(),
    data: body,
  });

const setAsDefault = (id: string, body: TUserSavedFilterUpdate) =>
  sendRequest<TUserSavedFilter>({
    method: 'PUT',
    url: `${SAVED_FILTER_API_URL}/${id}/default`,
    headers: headers(),
    data: body,
  });

const destroy = (id: string) =>
  sendRequest<string>({
    method: 'DELETE',
    url: `${SAVED_FILTER_API_URL}/${id}`,
    headers: headers(),
  });

export const SavedFilterApi = {
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
  setAsDefault,
};
