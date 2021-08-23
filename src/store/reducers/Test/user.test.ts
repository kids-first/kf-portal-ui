import { Action } from 'redux';

import {
  logout,
  receiveLoginProvider,
  receiveUserToken,
  receiveUserWithComputedValues,
  toggleIsLoadingUser,
} from 'store/actionCreators/user';
import { Providers, userInitialState, UserState } from 'store/userTypes';

import { MOCK_USER_1_NOT_ADMIN } from '../../actionCreators/Test/mockUserData';
import reducer from '../user';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState: UserState = {
  ...userInitialState,
};

describe('User Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    // @ts-ignore compilation does not allow such action, but must be tested for vanilla javascript
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle logout', () => {
    expect(reducer(initialState, logout())).toEqual({
      ...initialState,
    });
  });

  it('should handle receiveUserToken', () => {
    expect(reducer(initialState, receiveUserToken('abcdefg'))).toEqual({
      ...initialState,
      userToken: 'abcdefg',
    });
  });

  it('should handle receiveLoginProvider', () => {
    expect(reducer(initialState, receiveLoginProvider(Providers.orcid))).toEqual({
      ...initialState,
      loginProvider: Providers.orcid,
    });
  });

  it('should handle toggleIsLoadingUser', () => {
    expect(reducer(initialState, toggleIsLoadingUser(true))).toEqual({
      ...initialState,
      isLoadingUser: true,
    });
  });

  it('should handle receiveUser', () => {
    const enhancedUser = {
      ...MOCK_USER_1_NOT_ADMIN,
      isAdmin: false, //computed
      groups: [], //computed
    };

    const state: UserState = {
      ...initialState,
      loginProvider: Providers.google,
      userToken: 'eg84jlsjfldjfkl',
    };

    expect(reducer(state, receiveUserWithComputedValues(enhancedUser))).toEqual({
      ...state,
      isAuthenticated: true,
      isLoadingUser: false,
      uid: enhancedUser.egoId,
      user: { ...enhancedUser },
    });
  });

  it('should handle logout', () => {
    expect(reducer(initialState, logout())).toEqual({
      ...initialState,
    });
  });
});
