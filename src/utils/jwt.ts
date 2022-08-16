import { DecodedJwt } from "common/tokenTypes";

export const isDecodedJwtExpired = (decodedJwt: DecodedJwt) => {
  const currentTimestamp = new Date().getTime() / 1000;
  const expirationTimestamp = decodedJwt.exp;
  return expirationTimestamp <= currentTimestamp;
};
