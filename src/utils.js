export const getMsgFromErrorOrElse = (error, defaultIfNone = 'An Error Occurred') =>
  typeof error === 'object' && Object.prototype.hasOwnProperty.call(error, 'message')
    ? error.message
    : defaultIfNone;

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

export const hasUserRole = (user) => Array.isArray(user.roles) && !!user.roles[0];
