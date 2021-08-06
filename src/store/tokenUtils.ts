import jwtDecode from 'jwt-decode';

import { DecodedJwt, JwtToken } from './tokenTypes';
import { Nullable } from './utilityTypes';

export const extractGroupsFromToken = (rawToken: Nullable<JwtToken>): string[] => {
  if (!rawToken) {
    return [];
  }
  const decodedToken: DecodedJwt = jwtDecode(rawToken);
  return decodedToken?.context?.user?.groups || [];
};

export const isDecodedJwtExpired = (decodedJwt: DecodedJwt) => {
  const currentTimestamp = new Date().getTime() / 1000;
  const expirationTimestamp = decodedJwt.exp;
  return expirationTimestamp <= currentTimestamp;
};
