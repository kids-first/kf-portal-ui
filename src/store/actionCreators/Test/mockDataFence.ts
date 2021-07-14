import { DCF, GEN3 } from 'common/constants';
import { Api } from 'store/apiTypes';
import { FenceStudies } from 'store/fenceStudiesTypes';

export const mockApi: jest.Mocked<Api> = {
  api: () => {},
};

export const MOCK_GEN3_STUDY_PHS_001436 = {
  acl: ['*'],
  authorizedFiles: 5239,
  id: 'phs001436',
  studyShortName: 'Kids First: Neuroblastoma',
  totalFiles: 19791,
};

export const MOCK_GEN3_CONNECTION = {
  authz: {},

  certificates_uploaded: [],

  groups: [],
  is_admin: false,
  message: '',
  name: 'NAME',

  project_access: {},
  projects: { a: 'a', b: 'b', c: 'c' },
  resources: [],
  resources_granted: [],
  role: 'user',
  sub: 125,
  user_id: 125,
  username: 'NAME',
};

export const MOCK_DCF_CONNECTION = {
  authz: {},
  certificates_uploaded: [],
  groups: [],
  is_admin: false,
  message: '',
  name: 'NAME',
  project_access: {},
  projects: { x: 'x', y: 'y', z: 'z' },
  resources: [],
  resources_granted: [],
  role: 'user',
  sub: 125,
  user_id: 125,
  username: 'NAME',
};

export const MOCK_FENCE_CONNECTIONS = {
  [GEN3]: MOCK_GEN3_CONNECTION,
  [DCF]: MOCK_DCF_CONNECTION,
};

export const MOCK_STUDIES_IDS_AND_COUNTS = {
  CHEEZBURGER: { authorizedFiles: 1 },
  SD_1P41Z782: { authorizedFiles: 259 },
  phs001436: { authorizedFiles: 5239 },
};

export const MOCK_AUTH_STUDIES_GEN3 = [
  {
    acl: ['*'],
    authorizedFiles: 5239,
    id: `${GEN3}_1`,
    studyShortName: `studyShortName_${GEN3}_1`,
    totalFiles: 19791,
  },
];

export const MOCK_AUTH_STUDIES_DCF = [
  {
    acl: ['*'],
    authorizedFiles: 5239,
    id: `${DCF}_1`,
    studyShortName: `studyShortName_${DCF}_1`,
    totalFiles: 19791,
  },
];

export const MOCK_AUTH_STUDIES_WITH_2_FENCES: FenceStudies = {
  [GEN3]: {
    authorizedStudies: MOCK_AUTH_STUDIES_GEN3,
  },
  [DCF]: {
    authorizedStudies: MOCK_AUTH_STUDIES_DCF,
  },
};

export const MOCK_AUTH_STUDIES_FROM_GEN3 = [
  {
    acl: ['*'],
    studyShortName: 'Kids First: Neuroblastoma',
    totalFiles: 19791,
    id: 'phs001436',
    authorizedFiles: 5239,
  },
  {
    acl: ['*'],
    studyShortName: 'OpenDIPG: ICR London',
    totalFiles: 259,
    id: 'SD_1P41Z782',
    authorizedFiles: 259,
  },
  { acl: ['*'], studyShortName: 'Cat Pics', totalFiles: 82, id: 'CHEEZBURGER', authorizedFiles: 1 },
];
