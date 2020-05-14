/* https://catalinxyz.com/create-the-@bind-decorator-to-help-with-react-events-and-callback-props */
import get from 'lodash/get';
import isArrayLikeObject from 'lodash/isArrayLikeObject';
import toLower from 'lodash/toLower';
import jwtDecode from 'jwt-decode';

import { createProfile, getProfile } from 'services/profiles';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { CAVATICA, FENCES } from 'common/constants';
import { getAccessToken } from 'services/fence';
import { createExampleQueries } from 'services/riffQueries';

import { store } from 'store';
import { loginFailure, loginSuccess } from 'store/actionCreators/user';

export function bind(target, name, descriptor) {
  return {
    get() {
      const bound = descriptor.value.bind(this);

      Object.defineProperty(this, name, {
        value: bound,
      });

      return bound;
    },
  };
}

export const extractErrorMessage = (response, indexError = 0) => {
  if (!response) {
    return;
  }
  const data = response.data || {};
  const errors = data.errors;
  if (!Array.isArray(errors)) {
    return;
  }
  return (errors[indexError] || {}).message;
};

export const getMsgFromErrorOrElse = (error, defaultIfNone = 'An Error Occurred') =>
  typeof error === 'object' && Object.prototype.hasOwnProperty.call(error, 'message')
    ? error.message
    : defaultIfNone;

export const isAdminToken = ({ validatedPayload }) => {
  if (!validatedPayload) return false;
  const jwtUser = get(validatedPayload, 'context.user', {});
  const roles = jwtUser.roles;
  const type = jwtUser.type;
  // maintain backward compatibility
  return roles && null !== roles && isArrayLikeObject(roles)
    ? roles.includes('ADMIN')
    : type && type !== null && type === 'ADMIN';
};

export const validateJWT = ({ jwt }) => {
  if (!jwt) return false;
  const validatedPayload = jwtDecode(jwt);
  const isCurrent = new Date(validatedPayload.exp * 1000).valueOf() > Date.now();
  const status = get(validatedPayload, 'context.user.status', '');
  const isApproved =
    isAdminToken({ validatedPayload }) || [status].map(toLower).includes('approved');
  return isCurrent && isApproved && validatedPayload;
};

const initProfile = async (api, user, egoId) => {
  const profileCreation = createProfile(api)({ ...user, egoId });
  const sampleQueryCreation = createExampleQueries(api, egoId);
  const [x] = await Promise.all([profileCreation, sampleQueryCreation]);
  return x;
};

export const handleJWT = async ({ provider, jwt, onFinish, setToken, setUser, api }) => {
  const jwtData = validateJWT({ jwt });

  if (!jwtData) {
    setToken();
    // clear the user details in the redux store
    store.dispatch(loginFailure());
  } else {
    try {
      await setToken({ token: jwt, provider });
      const user = jwtData.context.user;
      const egoId = jwtData.sub;
      const existingProfile = await getProfile(api)();
      const newProfile = !existingProfile ? await initProfile(api, user, egoId) : {};
      const loggedInUser = {
        ...(existingProfile || newProfile),
        email: user.email,
        egoGroups: user.groups,
      };
      await setUser({ ...loggedInUser, api });
      onFinish && onFinish(loggedInUser);

      // store the user details in the redux store
      store.dispatch(loginSuccess(loggedInUser));
    } catch (err) {
      console.error('Error during login', err);
      // clear the user details in the redux store
      store.dispatch(loginFailure());
    }
  }
  return jwtData;
};

/**
 * fetchIntegrationTokens
 * For all SERVICES listed in common/constants, call the key-store to retrieve any keys stored
 *  for the user.
 * Each call to key-store is resolved separately and asynchronously. Their value will be added
 *  to state once returned.
 */
export const fetchIntegrationTokens = ({ setIntegrationToken, api }) => {
  getCavaticaUser()
    .then((userData) => {
      setIntegrationToken(CAVATICA, JSON.stringify(userData));
    })
    .catch((error) => {
      console.error(error);
      // Could not retrieve cavatica user info, nothing to do.
    });

  // Get Gen3 Secret here
  FENCES.forEach((fence) => {
    getAccessToken(api, fence)
      .then((key) => {
        setIntegrationToken(fence, key);
      })
      .catch((res) => {
        console.error('Error getting Gen3 API Key');
        console.error(res);
      });
  });
};

export const isSelfInUrlWhenLoggedIn = (userIdFromUrl, loggedInUser) => {
  if (!loggedInUser || Object.keys(loggedInUser).length === 0) {
    return true;
  }
  return loggedInUser._id === userIdFromUrl;
};

//#Source https://bit.ly/2neWfJ2
export const toKebabCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');

export const computeGravatarSrcFromEmail = (hashedEmail, options) => {
  const size = (options || {}).size || 100;
  const defaultImage = (options || {}).d || '';
  return `https://www.gravatar.com/avatar/${hashedEmail}?s=${size}&d=${defaultImage}`;
};

/**
 * copied : https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url/43467144
 * Loosely validate a URL `string`.
 *
 * @param {String} str
 * @return {Boolean}
 */
export function isUrl(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

/**
 * @param {Integer} rawInteger
 * @param {Integer} positionToKeepFromLeft
 * @return {Integer}
 *
 * @examples
 *
 * roundIntToChosenPowerOfTen(1, 2) => 1
 * roundIntToChosenPowerOfTen(4889832) => 4800000
 * roundIntToChosenPowerOfTen(78,1) => 70
 * roundIntToChosenPowerOfTen(63409,3) => 63400
 *
 * Note: positionToKeepFromLeft is the portion of the digit not to be rounded to a power of ten.
 * For instance, the keeping of the third position from the left of 63409 will result 63400
 */
export const roundIntToChosenPowerOfTen = (rawInteger, positionToKeepFromLeft = 2) => {
  const strRepresentation = rawInteger.toString();
  const numOfDigits = strRepresentation.length;
  if (numOfDigits < positionToKeepFromLeft) {
    return rawInteger;
  }
  const powerOfTenMultiplier = numOfDigits - positionToKeepFromLeft;
  const strMostSignificantDigits = strRepresentation.slice(0, positionToKeepFromLeft);
  const mostSignificantDigits = parseInt(strMostSignificantDigits, 10);
  return mostSignificantDigits * Math.pow(10, powerOfTenMultiplier);
};

//https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
export const jestPatchMatchMedia = () =>
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

export const getFieldDisplayName = (fieldName, extendedMapping) =>
  extendedMapping.find((mapping) => mapping.field === fieldName)?.displayName || fieldName;
