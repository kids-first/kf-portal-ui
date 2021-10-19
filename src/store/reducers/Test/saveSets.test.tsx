import { Action } from 'redux';

import {
  failureCreate,
  isDeletingSets,
  isEditingTag,
  isLoadingCreateSet,
  isLoadingSets,
  reInitializeSetsState,
} from 'store/actionCreators/saveSets';
import { logout } from 'store/actionCreators/user';
import reducer from 'store/reducers/saveSets';
import { LogoutAction } from 'store/userTypes';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState = {
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    sets: [],
    error: null,
    isLoading: false,
    isDeleting: false,
    isEditing: false,
  },
};

describe('Save Sets Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle togglePendingCreate', () => {
    expect(reducer(initialState, isLoadingCreateSet(true))).toEqual({
      create: {
        isLoading: true,
        error: null,
      },
      userSets: {
        sets: [],
        error: null,
        isLoading: false,
        isDeleting: false,
        isEditing: false,
      },
    });
  });

  it('should handle failure create', () => {
    expect(reducer(initialState, failureCreate(new Error('error')))).toEqual({
      create: {
        isLoading: false,
        error: new Error('error'),
      },
      userSets: {
        sets: [],
        error: null,
        isLoading: false,
        isDeleting: false,
        isEditing: false,
      },
    });
  });

  it('should handle re-initialize state', () => {
    const state = {
      create: {
        isLoading: true,
        error: Error('Some Error'),
      },
      userSets: {
        sets: [],
        error: null,
        isLoading: false,
        isDeleting: false,
        isEditing: false,
      },
    };
    expect(reducer(state, reInitializeSetsState())).toEqual(initialState);
  });

  it('should handle toggle loading save sets', () => {
    expect(reducer(initialState, isLoadingSets(true))).toEqual({
      create: {
        isLoading: false,
        error: null,
      },
      userSets: {
        sets: [],
        error: null,
        isLoading: true,
        isDeleting: false,
        isEditing: false,
      },
    });
  });

  it('should handle delete save sets', () => {
    expect(reducer(initialState, isDeletingSets(true))).toEqual({
      create: {
        isLoading: false,
        error: null,
      },
      userSets: {
        sets: [],
        error: null,
        isLoading: false,
        isDeleting: true,
        isEditing: false,
      },
    });
  });

  it('should handle editing save sets tag', () => {
    const setId = '1234';
    const tag = 'someSet';

    expect(reducer(initialState, isEditingTag(setId, tag))).toEqual({
      create: {
        isLoading: false,
        error: null,
      },
      userSets: {
        sets: [],
        error: null,
        isLoading: false,
        isDeleting: false,
        isEditing: false,
      },
    });
  });

  it('should handle logout', () => {
    const state = {
      create: {
        isLoading: false,
        error: null,
      },
      userSets: {
        sets: [{ size: 1, tag: 'tag', setId: 'name' }],
        error: null,
        isLoading: false,
        isDeleting: false,
        isEditing: false,
      },
    };
    expect(reducer(state, logout() as LogoutAction)).toEqual(initialState);
  });
});
