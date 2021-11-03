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
      return { ...state, user: action.payload, uid: action.payload.egoId };
    }
    case UserActions.toggleIsLoadingUser: {
      return { ...state, isLoadingUser: action.isLoading };
    }
    default:
      return state;
  }
};
