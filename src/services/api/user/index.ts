import EnvironmentVariables from 'helpers/EnvVariables';
import keycloak from 'auth/keycloak-api/keycloak';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import { TUser, TUserInsert, TUserUpdate } from './models';
import { sendRequest } from 'services/api';

export const USER_API_URL = `${EnvironmentVariables.configFor('USERS_API')}/user`;

export const headers = () => ({
  'Content-Type': 'application/json',
});

const fetch = () =>
  sendRequest<TUser>({
    method: 'GET',
    url: USER_API_URL,
    headers: headers(),
  });

const create = (body?: Omit<TUserInsert, 'keycloak_id'>) => {
  const tokenParsed = keycloak.tokenParsed as KidsFirstKeycloakTokenParsed;
  return sendRequest<TUser>({
    method: 'POST',
    url: USER_API_URL,
    headers: headers(),
    data: {
      ...body,
      email: body?.email || tokenParsed.email || tokenParsed.identity_provider_identity,
      first_name: body?.first_name || tokenParsed.given_name,
      last_name: body?.last_name || tokenParsed.family_name,
    },
  });
};

const search = ({
  pageIndex = 0,
  pageSize = 15,
  match,
  sort,
  roles,
  dataUses,
}: {
  pageIndex?: number;
  pageSize?: number;
  match?: string;
  sort?: string;
  roles?: string;
  dataUses?: string;
}) =>
  sendRequest<{
    users: TUser[];
    total: number;
  }>({
    method: 'GET',
    url: `${USER_API_URL}/search`,
    headers: headers(),
    params: {
      pageIndex: pageIndex,
      pageSize: pageSize,
      match,
      sort,
      roles,
      dataUses,
    },
  });

const update = (body: TUserUpdate) =>
  sendRequest<TUser>({
    method: 'PUT',
    url: USER_API_URL,
    headers: headers(),
    data: body,
  });

const deleteUser = () =>
  sendRequest<void>({
    method: 'DELETE',
    url: USER_API_URL,
    headers: headers(),
  });

export const UserApi = {
  search,
  fetch,
  create,
  update,
  deleteUser,
};
