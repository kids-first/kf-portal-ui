import { get, endsWith } from 'lodash';
import urlJoin from 'url-join';

import { egoApiRoot, egoAppId } from 'common/injectGlobals';

import ajax from 'services/ajax';

const ERROR_MSG_PREFIX = '[Ego Orcid Auth] ';

/**
 * Sends Orcid's `code` to Ego to obtain Ego's JWT token.
 * @param {String} code - the code returned by Orcid
 * @returns {Promise<String>} - a Promise of Ego's JWT token.
 */
export const getOrcidToken = code => {
  const uri = urlJoin(egoApiRoot, 'oauth/orcid/token');
  return ajax(uri, {
    headers: { code },
    params: {
      client_id: egoAppId,
    },
  })
    .then(res => {
      const token = get(res, 'data', null);
      if (!token) {
        throw new Error(`${ERROR_MSG_PREFIX}Missing "token"`);
      }
      return token;
    })
    .catch(err => {
      const possibleErrors = ['email.empty', 'email.not.verified'];
      const data = err.response && err.response.data;
      if (possibleErrors.includes(data)) {
        throw data;
      }

      throw getErrorFromResponseError(err, `${ERROR_MSG_PREFIX}Unhandled error`);
    });
};

export const orcidLogout = () => {};

/**
 * Generates a human readable error message from a error thrown by the `graphql` function.
 * @see https://www.npmjs.com/package/axios#handling-errors
 * @param {Object} error - an error message returned by `axios`
 * @param {String} customMsg - a message appended to the begining of the message
 * @returns {Error} - a atandardized, transport agnostic `Error` object.
 */
const getErrorFromResponseError = (error, customMsg = '') => {
  customMsg = customMsg && !endsWith(/\n/) ? customMsg + '\n' : customMsg;

  // Falsey values are not normal errors
  if (!error) {
    return new Error(`${customMsg}\n
      Empty error: ${error}`);
  }

  const url = get(error, 'config.url', '') || get(error, 'request.url', '');

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status, statusText, headers } = error.response;
    return new Error(`${customMsg}Request Url: ${url}\n
      Status: ${status} ${statusText}\n
      Response headers: ${serialize(headers)}\n
      Response body: ${serialize(data)}`);
  }

  if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    const { status, statusText } = error.request;
    return new Error(`${customMsg}No response was received\n
      Request Url: ${url}\n
      Status: ${status} ${statusText}`);
  }

  // Something happened in setting up the request that triggered an Error
  if (error.message) {
    // Assume a plain `Error` object, or close enough
    return new Error(`${customMsg}${error.message}`);
  }

  // If error is a plain error that does not match any of the above, try to serialize it
  if (typeof error === 'object') {
    return new Error(`${customMsg}Unhandled "object" error: ${serialize(error)}`);
  }

  // If all else fails...
  return new Error(`${customMsg}Unhandled error: ${serialize(error)}`);
};

/**
 * Returns a selialized value for any object.
 * @param {any} value - absolutely any value
 * @returns {String} - a String value.
 */
const serialize = value => {
  if (typeof value === 'object') {
    try {
      // also handles null
      return JSON.stringify(value, null, 2);
    } catch (err) {
      try {
        return value.toString();
      } catch (err2) {
        return '[object]';
      }
    }
  }
  return '' + value;
};
