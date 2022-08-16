export interface IFenceAuthPayload {
  authenticated: boolean;
  expiration?: number;
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
