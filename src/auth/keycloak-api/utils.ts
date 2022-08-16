import Axios, { AxiosResponse } from "axios";
import jwtdecode from "jwt-decode";
import keycloak from "auth/keycloak-api/keycloak";
import { keycloakConfig } from "auth/keycloak-api/config";

const client = Axios.create({
  timeout: 15000,
});
client.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

export const KEYCLOAK_AUTH_RESOURCE_PATIENT_VARIANTS = "patient-variants";
export const KEYCLOAK_AUTH_RESOURCE_PATIENT_FAMILY = "patient-family";
export const KEYCLOAK_AUTH_RESOURCE_PATIENT_FILES = "patient-files";
export const KEYCLOAK_AUTH_RESOURCE_PATIENT_PRESCRIPTIONS =
  "patient-prescriptions";
export const KEYCLOAK_AUTH_RESOURCE_PATIENT_LIST = "patient-list";

export const KEYCLOAK_AUTH_RESOURCES = [
  KEYCLOAK_AUTH_RESOURCE_PATIENT_LIST,
  KEYCLOAK_AUTH_RESOURCE_PATIENT_PRESCRIPTIONS,
  KEYCLOAK_AUTH_RESOURCE_PATIENT_FILES,
  KEYCLOAK_AUTH_RESOURCE_PATIENT_FAMILY,
  KEYCLOAK_AUTH_RESOURCE_PATIENT_VARIANTS,
];

export const KEYCLOAK_AUTH_GRANT_TYPE =
  "urn:ietf:params:oauth:grant-type:uma-ticket";
export const KEYCLOAK_AUTH_RESPONSE_MODE = "permissions";

export const KEYCLOAK_REFRESH_GRANT_TYPE = "refresh_token";

export type Rpt = {
  decoded: DecodedRpt;
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
};

export type DecodedRpt = {
  exp: number;
  iat: number;
  auth_time: number;
  iss: string;
  authorization: {
    permissions: {
      rsid: string;
      rsname: string;
    }[];
  };
};

const CLOSE_TO_EXPIRE_TIME = 300; // 5 minutes in seconds

const tokenStatus = (iat: number, expires_in: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = iat + expires_in;

  return {
    expired: currentTime > expirationTime,
    closeToExpire: expirationTime - currentTime <= CLOSE_TO_EXPIRE_TIME,
  };
};

const decodeRptFromResponse = (response: AxiosResponse<any>): Rpt => {
  const decoded: DecodedRpt = jwtdecode(response.data.access_token);
  return {
    decoded,
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    accessExpiresIn: response.data.expires_in,
    refreshExpiresIn: response.data.refresh_expires_in,
  };
};

export const getAccessTokenStatus = (rpt: Rpt) =>
  tokenStatus(rpt.decoded.iat, rpt.accessExpiresIn);

export const rptRequest = async (data: any) => {
  const response = await client.post(
    `${keycloakConfig.url}/realms/includedcc/protocol/openid-connect/token`,
    data
  );
  return decodeRptFromResponse(response);
};
