import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import EnvironmentVariables from 'helpers/EnvVariables';

import { sendRequest } from 'services/api';

import {
  IUserSetOutput,
  IUserSetOutputAlias,
  TBiospecimenRequest,
  TUserSavedSet,
  TUserSavedSetInsert,
  TUserSavedSetUpdate,
} from './models';

export const SETS_API_URL = `${EnvironmentVariables.configFor('ARRANGER_API')}/sets`;
const USERS_API_URL = `${EnvironmentVariables.configFor('USERS_API')}/user-sets`;

const headers = () => ({
  'Content-Type': 'application/json',
});

const fetchAll = () =>
  sendRequest<IUserSetOutput[]>({
    method: 'GET',
    url: SETS_API_URL,
    headers: headers(),
  });

const fetchSetsAliases = (sqon: ISyntheticSqon[]) =>
  sendRequest<{ data: IUserSetOutputAlias[] }>({
    method: 'POST',
    url: `${SETS_API_URL}/aliases`,
    headers: headers(),
    data: {
      queries: sqon,
    },
  });

const shareById = (id: string) =>
  sendRequest<IUserSetOutput>({
    method: 'PUT',
    url: `${USERS_API_URL}/shared/${id}`,
    headers: headers(),
  });

const getSharedById = (id: string) =>
  sendRequest<TBiospecimenRequest>({
    method: 'GET',
    url: `${USERS_API_URL}/shared/${id}`,
    headers: headers(),
  });

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
  fetchSetsAliases,
  fetchById,
  create,
  update,
  destroy,
  shareById,
  setAsDefault,
  getSharedById,
};
