import EnvironmentVariables from 'helpers/EnvVariables';
import keycloak from 'auth/keycloak-api/keycloak';
import { IncludeKeycloakTokenParsed } from 'common/tokenTypes';
import { TUser, TUserInsert, TUserUpdate } from './models';
import { sendRequest, sendRequestMock } from 'services/api';

export const USER_API_URL = `${EnvironmentVariables.configFor('USERS_API')}/user`;

export const headers = () => ({
  'Content-Type': 'application/json',
});

const fetch = () =>
  sendRequestMock<TUser>(
    {
      method: 'GET',
      url: USER_API_URL,
      headers: headers(),
    },
    {
      id: 232,
      keycloak_id: 'f7d747c2-d88a-4b61-b9dc-e3e8c578c1e3',
      first_name: 'John',
      last_name: 'Dow',
      era_commons_id: '21312312',
      nih_ned_id: null,
      commercial_use_reason: null,
      email: 'john@doe.bio',
      external_individual_fullname: null,
      external_individual_email: null,
      roles: ['Tool or Algorithm Developer'],
      affiliation: 'chu',
      portal_usages: [
        'Learning more about Down syndrome and its health outcomes, management, and/or treatment',
      ],
      research_area: null,
      creation_date: '2022-08-01T18:06:06.253Z',
      updated_date: '2022-08-01T18:06:06.366Z',
      consent_date: '2022-08-01T18:06:06.163Z',
      accepted_terms: true,
      understand_disclaimer: true,
      completed_registration: true,
      config: {},
    },
  );

const create = (body?: Omit<TUserInsert, 'keycloak_id'>) => {
  const tokenParsed = keycloak.tokenParsed as IncludeKeycloakTokenParsed;
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
