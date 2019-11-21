import { ERROR_DISPLAY, ERROR_DISMISSED } from '../actionTypes';
import uuid from 'uuid';

const initialState = {
  errors: [
    // {
    //   uuid: string,
    //   message: string,
    // },
  ],
  currentError: null, // null | object
};

const toError = payload => ({
  uuid: uuid(),
  message: String(payload.message ? payload.message : payload),
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ERROR_DISPLAY:
      const newError = toError(action.payload);
      return {
        errors: state.errors.concat(newError),
        currentError: state.currentError === null ? newError : state.currentError,
      };
    case ERROR_DISMISSED:
      const filteredErrors = state.errors.filter(err => err.uuid !== action.payload);
      return {
        errors: filteredErrors,
        currentError: filteredErrors[0] || null,
      };
    default:
      return state;
  }
};
