import { UserActions, UserActionTypes, userInitialState, UserState } from '../userTypes';

const initialState: UserState = userInitialState;

export default (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case UserActions.loginFailure:
      return { ...initialState };
    case UserActions.logout:
      return { ...initialState, isLoadingUser: false };
    case UserActions.requestSubscribeUser: {
      return state;
    }
    case UserActions.failureSubscribeUser: {
      return {
        ...state,
        errorSubscribing: action.payload,
      };
    }
    case UserActions.receiveUser: {
      return { ...state, user: action.payload, isAuthenticated: true, uid: action.payload.egoId };
    }
    case UserActions.removeUser: {
      return { ...state, user: null, isAuthenticated: false };
    }
    case UserActions.toggleIsLoadingUser: {
      return { ...state, isLoadingUser: action.isLoading };
    }
    case UserActions.receiveUserToken: {
      const userToken = action.userToken;
      return {
        ...state,
        userToken: userToken,
      };
    }
    case UserActions.receiveLoginProvider: {
      return { ...state, loginProvider: action.loginProvider };
    }
    case UserActions.removeUserToken: {
      return { ...state, userToken: null, user: null, isAuthenticated: false };
    }
    case UserActions.removeLoginProvider: {
      return { ...state, loginProvider: null, isAuthenticated: false };
    }
    default:
      return state;
  }
};
