import { KeycloakTokenParsed } from "keycloak-js";

export type DecodedJwt = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
  jti: string;
  context: {
    user: {
      name: string;
      email: string;
      status: string;
      firstName: string;
      lastName: string;
      createdAt: string;
      lastLogin: string;
      preferredLanguage: null;
      groups: string[];
      roles: string[];
      [index: string]: any;
    };
  };
  [index: string]: any;
};

export interface IncludeKeycloakTokenParsed extends KeycloakTokenParsed {
  groups: string[];
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  identity_provider: string;
  identity_provider_identity: string;
}
