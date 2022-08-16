export enum FENCE_NAMES {
  gen3 = 'gen3',
  cavatica = 'cavatica',
}

export const ALL_FENCE_NAMES = [FENCE_NAMES.gen3, FENCE_NAMES.cavatica];
export const ALL_STUDIES_FENCE_NAMES = [FENCE_NAMES.gen3];

export enum FENCE_CONNECTION_STATUSES {
  connected = 'connected',
  disconnected = 'disconnected',
  unknown = 'unknown',
}

export type TFenceConnections = {
  [FENCE_NAMES.gen3]?: TConnection;
  [FENCE_NAMES.cavatica]?: TConnection;
};

export type TProjects = { [index: string]: any };

export type TConnection = {
  authz: { [index: string]: any };
  azp: string | null;
  certificates_uploaded: any[];
  display_name: string | null;
  email: string | null;
  groups: string[];
  is_admin: boolean;
  message: string;
  name: string;
  phone_number: string | null;
  preferred_username: string | null;
  primary_google_service_account: string | null;
  project_access: { [index: string]: any };
  projects: TProjects;
  resources: any[];
  resources_granted: any[];
  role: string;
  sub: number;
  user_id: number;
  username: string;
};
