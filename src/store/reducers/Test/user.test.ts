import { Action } from 'redux';

import {
  logout,
  receiveUserWithComputedValues,
  toggleIsLoadingUser,
} from 'store/actionCreators/user';
import { userInitialState, UserState } from 'store/userTypes';

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
    };

    expect(reducer(state, receiveUserWithComputedValues(enhancedUser))).toEqual({
      ...state,
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
