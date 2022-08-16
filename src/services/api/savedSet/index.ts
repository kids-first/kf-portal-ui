import EnvironmentVariables from 'helpers/EnvVariables';
import { TUserSavedSetInsert, TUserSavedSetUpdate, TUserSavedSet, IUserSetOutput } from './models';
import { sendRequest, sendRequestMock } from 'services/api';

const SETS_API_URL = `${EnvironmentVariables.configFor('ARRANGER_API')}/sets`;

const headers = () => ({
  'Content-Type': 'application/json',
});

const fetchAll = (tag?: string) =>
  sendRequestMock<IUserSetOutput[]>(
    {
      method: 'GET',
      url: SETS_API_URL,
      headers: headers(),
    },
    [],
  );

const fetchById = (id: string) =>
  sendRequest<IUserSetOutput>({
    method: 'GET',
    url: `${SETS_API_URL}/${id}`,
    headers: headers(),
  });

const create = (body: TUserSavedSetInsert) =>
  sendRequest<IUserSetOutput>({
    method: 'POST',
    url: SETS_API_URL,
    headers: headers(),
    data: body,
  });

const update = (id: string, body: TUserSavedSetUpdate) =>
  sendRequest<IUserSetOutput>({
    method: 'PUT',
    url: `${SETS_API_URL}/${id}`,
    headers: headers(),
    data: body,
  });

const setAsDefault = (id: string, body: TUserSavedSetUpdate) =>
  sendRequest<TUserSavedSet>({
    method: 'PUT',
    url: `${SETS_API_URL}/${id}/default`,
    headers: headers(),
    data: body,
  });

const destroy = (id: string) =>
  sendRequest<string>({
    method: 'DELETE',
    url: `${SETS_API_URL}/${id}`,
    headers: headers(),
  });

export const SavedSetApi = {
  fetchAll,
  fetchById,
  create,
  update,
  destroy,
  setAsDefault,
};
