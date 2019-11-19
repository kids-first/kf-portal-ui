import { ERROR_DISPLAY, ERROR_DISMISSED } from '../actionTypes';

/**
 * Displays a dismissible error to the user.
 * @param {{message:String}|String} error - An error, either in form of a `string` or an object with a `message` property, e.g. `Error`.
 */
export const displayError = error => ({
  type: ERROR_DISPLAY,
  payload: error,
});

/**
 * Dismisses an error by it's unique identifier, or prevent it from appearing.
 * @param {String} errorUuid - the unique identifier of an error.
 */
export const dismissError = errorUuid => ({
  type: ERROR_DISMISSED,
  payload: errorUuid,
});
