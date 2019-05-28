import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actionTypes';

const initialState = {
  loggedInUser: null,
  uid: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedInUser: action.payload,
        uid: action.payload.egoId,
      };
    case LOGIN_FAILURE:
      return { ...initialState };
    case LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
};
