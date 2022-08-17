import axios, { AxiosRequestConfig } from 'axios';
import { TUser } from './user/models';
import { TUserSavedFilter } from './savedFilter/models';
import { ApiResponse } from '.';
import { SETS_API_URL } from './savedSet';
import { IUserSetOutput } from './savedSet/models';
import { USER_API_URL } from './user';
import { SAVED_FILTER_API_URL } from './savedFilter';
import { FENCE_NAMES } from 'common/fenceTypes';
import { IFenceAclsPayload, IFenceAuthPayload } from './fence/models';
import { FENCE_API_URL } from './fence';

const apiInstance = axios.create();

const sendRequestMock = async <T,>(config: AxiosRequestConfig, mockResponsed: any) => {
  return apiInstance
    .request<T>(config)
    .then(
      (response): ApiResponse<T> => ({
        response: response,
        data: mockResponsed,
        error: undefined,
      }),
    )
    .catch((err): ApiResponse<T> => {
      console.log('MOCK', config.url, mockResponsed); //TODO: to remove

      return {
        response: err.response,
        data: mockResponsed,
        error: undefined,
      };
    });
};

export const Mock_UserService = {
  fetch: (headers: Function) =>
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
    ),
};

export const Mock_SavedFilter = {
  fetchAll: (headers: Function, tag?: string) =>
    sendRequestMock<TUserSavedFilter[]>(
      {
        method: 'GET',
        url: `${SAVED_FILTER_API_URL}${tag ? '/tag/' + tag : ''}`,
        headers: headers(),
      },
      [],
    ),
};

export const Mock_SavedSet = {
  fetchAll: (headers: Function, tag?: string) =>
    sendRequestMock<IUserSetOutput[]>(
      {
        method: 'GET',
        url: SETS_API_URL,
        headers: headers(),
      },
      [],
    ),
};

export const Mock_FenceConnection = {
  isAuthenticated: (fence: FENCE_NAMES) =>
    sendRequestMock<IFenceAuthPayload>(
      {
        url: `${FENCE_API_URL}/${fence}/authenticated`,
        method: 'GET',
      },
      { authenticated: false },
    ),
  fetchAcls: (fence: FENCE_NAMES) =>
    sendRequestMock<IFenceAclsPayload>(
      {
        url: `${FENCE_API_URL}/${fence}/acl`,
        method: 'GET',
      },
      {
        acl: ['mock.c1', 'mock.c2', 'mock.c999', 'mock.c1', 'mock.c2', 'mock.c999'],
      },
    ),
};

export const Mock_FenceStudies = {
  AuthorizedStudyIdsAndCount: {
    data: {
      file: {
        MOCK_1: {
          acl: { buckets: [{ key: 'mock.c1' }, { key: 'mock.c999' }] },
          participants__study__study_name: {
            buckets: [
              {
                key: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempor volutpat rhoncus.',
                doc_count: 3899,
              },
            ],
          },
        },
        MOCK_2: {
          acl: {
            buckets: [{ key: 'mock.c999' }, { key: 'mock.c1' }, { key: 'mock.c2' }],
          },
          participants__study__study_name: {
            buckets: [
              {
                key: 'Integer at pulvinar sapien.',
                doc_count: 2714,
              },
            ],
          },
        },
        MOCK_3: {
          acl: {
            buckets: [{ key: 'mock.c1' }, { key: 'mock.c999' }, { key: '__missing__' }],
          },
          participants__study__study_name: {
            buckets: [{ key: 'Etiam commodo fringilla tristique.', doc_count: 4083 }],
          },
        },
        MOCK_4: {
          acl: { buckets: [{ key: 'mock.c1' }, { key: 'mock.c999' }] },
          participants__study__study_name: {
            buckets: [
              {
                key: 'Integer posuere, odio at varius rutrum, lorem tellus convallis augue',
                doc_count: 818,
              },
            ],
          },
        },
      },
    },
  },
};
