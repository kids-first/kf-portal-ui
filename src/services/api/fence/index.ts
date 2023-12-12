import EnvironmentVariables from 'helpers/EnvVariables';
import { ARRANGER_API } from 'provider/ApolloProvider';

import { FENCE_NAMES } from 'common/fenceTypes';
import { IAuthorizedStudiesFetchParams } from 'store/fences/types';

import { sendRequest } from '..';

import {
  IAuthorizedStudiesPayload,
  IFenceAclsPayload,
  IFenceAuthPayload,
  IFenceInfo,
} from './models';

export const FENCE_API_URL = EnvironmentVariables.configFor('FENCE_API_URL');

const fetchAuthorizedStudies = (params: IAuthorizedStudiesFetchParams) =>
  sendRequest<IAuthorizedStudiesPayload>({
    method: 'POST',
    url: `${ARRANGER_API}/authorized-studies`,
    data: params,
  });

const isAuthenticated = (fence: FENCE_NAMES) =>
  sendRequest<IFenceAuthPayload>({
    url: `${FENCE_API_URL}/${fence}/authenticated`,
    method: 'GET',
  });

const fetchAcls = (fence: FENCE_NAMES) =>
  sendRequest<IFenceAclsPayload>({
    url: `${FENCE_API_URL}/${fence}/acl`,
    method: 'GET',
  });

const fetchInfo = (fence: FENCE_NAMES) =>
  sendRequest<IFenceInfo>({
    url: `${FENCE_API_URL}/${fence}/info`,
    method: 'GET',
  });

const exchangeCode = (fence: FENCE_NAMES, code: string) =>
  sendRequest({
    url: `${FENCE_API_URL}/${fence}/exchange`,
    method: 'GET',
    params: {
      code,
    },
  });

const disconnect = (fence: FENCE_NAMES) =>
  sendRequest({
    url: `${FENCE_API_URL}/${fence}/token`,
    method: 'DELETE',
  });

export const FenceApi = {
  fetchAuthorizedStudies,
  isAuthenticated,
  fetchInfo,
  exchangeCode,
  disconnect,
  fetchAcls,
};
