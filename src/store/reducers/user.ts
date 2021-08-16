import { UserActions, UserActionTypes, userInitialState, UserState } from '../userTypes';

const initialState: UserState = userInitialState;

export default (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
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
    case UserActions.receiveUserWithComputedValues: {
      return { ...state, user: action.payload, isAuthenticated: true, uid: action.payload.egoId };
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
    default:
      return state;
  }
};
