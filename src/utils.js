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
