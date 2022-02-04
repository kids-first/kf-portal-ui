import { Api } from 'store/apiTypes';
import { FenceStudies } from 'store/fenceStudiesTypes';

import { FenceName } from '../../fenceTypes';
import { OPEN_ACCESS } from '../fenceStudies';

export const mockApi: jest.Mocked<Api> = {
  // @ts-ignore just a mock to call the api - no need add complex types.
  api: () => {},
};

export const MOCK_GEN3_STUDY_PHS_001436 = {
  acl: [OPEN_ACCESS],
  authorizedFiles: 5239,
  id: 'phs001436',
  studyShortName: 'Kids First: Neuroblastoma',
  totalFiles: 19791,
};

export const MOCK_GEN3_CONNECTION = {
  authz: {},
  azp: null,
  certificates_uploaded: [],
  display_name: null,
  email: null,
  groups: [],
  is_admin: false,
  message: '',
  name: 'NAME',
  phone_number: null,
  preferred_username: null,
  primary_google_service_account: null,
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
  azp: null,
  certificates_uploaded: [],
  display_name: null,
  email: null,
  groups: [],
  is_admin: false,
  message: '',
  name: 'NAME',
  phone_number: null,
  preferred_username: null,
  primary_google_service_account: null,
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
  [FenceName.gen3]: MOCK_GEN3_CONNECTION,
  [FenceName.dcf]: MOCK_DCF_CONNECTION,
};

export const MOCK_STUDIES_IDS_AND_COUNTS = {
  CHEEZBURGER: { authorizedFiles: 1 },
  SD_1P41Z782: { authorizedFiles: 259 },
  phs001436: { authorizedFiles: 5239 },
};

export const MOCK_AUTH_STUDIES_GEN3 = [
  {
    acl: [OPEN_ACCESS],
    authorizedFiles: 5239,
    id: `${FenceName.gen3}_1`,
    studyShortName: `studyShortName_${FenceName.gen3}_1`,
    totalFiles: 19791,
  },
];

export const MOCK_AUTH_STUDIES_DCF = [
  {
    acl: [OPEN_ACCESS],
    authorizedFiles: 5239,
    id: `${FenceName.dcf}_1`,
    studyShortName: `studyShortName_${FenceName.dcf}_1`,
    totalFiles: 19791,
  },
];

export const MOCK_AUTH_STUDIES_WITH_2_FENCES: FenceStudies = {
  [FenceName.gen3]: {
    authorizedStudies: MOCK_AUTH_STUDIES_GEN3,
  },
  [FenceName.dcf]: {
    authorizedStudies: MOCK_AUTH_STUDIES_DCF,
  },
};

export const MOCK_AUTH_STUDIES_FROM_GEN3 = [
  {
    acl: [OPEN_ACCESS],
    studyShortName: 'Kids First: Neuroblastoma',
    totalFiles: 19791,
    id: 'phs001436',
    authorizedFiles: 5239,
  },
  {
    acl: [OPEN_ACCESS],
    studyShortName: 'OpenDIPG: ICR London',
    totalFiles: 259,
    id: 'SD_1P41Z782',
    authorizedFiles: 259,
  },
  {
    acl: [OPEN_ACCESS],
    studyShortName: 'Cat Pics',
    totalFiles: 82,
    id: 'CHEEZBURGER',
    authorizedFiles: 1,
  },
];
