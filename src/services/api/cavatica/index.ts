import EnvironmentVariables from 'helpers/EnvVariables';
import { sendRequest } from 'services/api';
import {
  ICavaticaBillingGroup,
  ICavaticaCreateProjectBody,
  ICavaticaDRSImportBody,
  ICavaticaDRSImportJobPayload,
  ICavaticaListPayload,
  ICavaticaProject,
  ICavaticaProjectNode,
  ICavaticaProjectMember,
} from './models';

const KEY_MANAGER_API_URL = EnvironmentVariables.configFor('KEY_MANAGER_API_URL');
const CAVATICA_FENCE_PROXY = EnvironmentVariables.configFor('CAVATICA_FENCE_PROXY');
const CAVATICA_PROXY_URL = `${KEY_MANAGER_API_URL}/${CAVATICA_FENCE_PROXY}/v2`;

const headers = () => ({
  'Content-Type': 'application/json',
});

const fetchProjects = () =>
  sendRequest<ICavaticaListPayload<ICavaticaProject>>({
    method: 'GET',
    url: `${CAVATICA_PROXY_URL}/projects`,
    headers: headers(),
  });

const fetchProjetMembers = (projectId: string) =>
  sendRequest<ICavaticaListPayload<ICavaticaProjectMember>>({
    method: 'GET',
    url: `${CAVATICA_PROXY_URL}/projects/${projectId}/members`,
    headers: headers(),
  });

const fetchBillingGroups = () =>
  sendRequest<ICavaticaListPayload<ICavaticaBillingGroup>>({
    method: 'GET',
    url: `${CAVATICA_PROXY_URL}/billing/groups`,
    headers: headers(),
  });

const createProject = (data: ICavaticaCreateProjectBody) =>
  sendRequest<ICavaticaProject>({
    method: 'POST',
    url: `${CAVATICA_PROXY_URL}/projects`,
    headers: headers(),
    data,
  });

const listFilesAndFolders = (parentId: string, isProject: boolean = false) =>
  sendRequest<ICavaticaListPayload<ICavaticaProjectNode>>({
    method: 'GET',
    url: `${CAVATICA_PROXY_URL}/files`,
    headers: headers(),
    params: {
      [isProject ? 'project' : 'parent']: parentId,
    },
  });

const startBulkDrsImportJob = (data: ICavaticaDRSImportBody) =>
  sendRequest<ICavaticaDRSImportJobPayload>({
    method: 'POST',
    url: `${CAVATICA_PROXY_URL}/bulk/drs/imports/create`,
    headers: headers(),
    data,
  });

export const CavaticaApi = {
  fetchProjects,
  fetchProjetMembers,
  fetchBillingGroups,
  createProject,
  listFilesAndFolders,
  startBulkDrsImportJob,
};
