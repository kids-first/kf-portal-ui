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

export const isNumber = (n) => n && !Number.isNaN(n);

export const toExponentialNotation = (numberCandidate, fractionDigits = 2) =>
  isNumber(numberCandidate) ? numberCandidate.toExponential(fractionDigits) : numberCandidate;

const computeStartStopPagination = (currentPage, pageSize, total) => {
  const isLessOrEqualThanPageSize = total <= pageSize;
  if (isLessOrEqualThanPageSize) {
    return [1, total];
  }

  const nOfPositionsCoveredByPageSize = total - (total % pageSize);

  const cursorOfLastPosition = currentPage * pageSize;
  const isLastPositionCovered = cursorOfLastPosition <= nOfPositionsCoveredByPageSize;
  if (isLastPositionCovered) {
    const start = cursorOfLastPosition - pageSize + 1;
    return [start, cursorOfLastPosition];
  }
  const start = nOfPositionsCoveredByPageSize + 1;
  return [start, total];
};

export const generatePaginationMessage = (currentPage, pageSize, total) => {
  const [start, stop] = computeStartStopPagination(currentPage, pageSize, total);
  return `Showing ${start.toLocaleString()} - ${stop.toLocaleString()} of ${total.toLocaleString()}`;
};

const canQuotientBeComputed = (num, denum) => {
  const areNumbers = !isNaN(num) && !isNaN(denum);
  return areNumbers && denum !== 0;
};

export const formatQuotientOrElse = (num, denum, defaultValue = '') =>
  canQuotientBeComputed(num, denum) ? `${num} / ${denum}` : defaultValue;

export const formatQuotientToExponentialOrElse = (num, denum, defaultValue = '') =>
  canQuotientBeComputed(num, denum) ? `${toExponentialNotation(num / denum)}` : defaultValue;

//ref: https://nofluffweb.com/mock-local-storage-in-jest-tests
export const makeFakeLocalStorage = () => {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
};

//https://ourcodeworld.com/articles/read/713/converting-bytes-to-human-readable-values-kb-mb-gb-tb-pb-eb-zb-yb-with-javascript
export const formatBytesToHumanReadable = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0';
  }

  const scale = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const matchedIndex = Math.floor(Math.log(bytes) / Math.log(scale));

  return (
    parseFloat((bytes / Math.pow(scale, matchedIndex)).toFixed(dm)) + ' ' + sizes[matchedIndex]
  );
};
