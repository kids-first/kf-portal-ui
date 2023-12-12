import { IAuthorizedStudy } from '@ferlab/ui/core/components/AuthorizedStudies';

export interface IFenceAuthPayload {
  authenticated: boolean;
  expiration?: number;
}

export interface IAuthorizedStudiesPayload {
  [key: string]: {
    data: IAuthorizedStudy[];
    error: boolean;
  };
}

export interface IFenceAclsPayload {
  acl: string[];
}

export interface IFenceInfo {
  authorize_uri: string;
  scope: string;
  redirect_uri: string;
  client_id: string;
  proxy_uri: string;
}

export interface IFenceExchange {
  expiration: number;
}
