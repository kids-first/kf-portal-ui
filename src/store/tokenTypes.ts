import { KeycloakTokenParsed } from 'keycloak-js';

export type JwtToken = string;

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

export type KcTokenParsedPlusClaims = KeycloakTokenParsed & {
  groups: string[];
};
