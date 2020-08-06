import reducer from '../saveSets';
import { Action } from 'redux';
import {
  failureCreate,
  reInitializeSaveSetsState,
  togglePendingCreate,
  toggleTagNameExist,
} from '../../actionCreators/saveSets';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState = {
  create: {
    isLoading: false,
    error: null,
    tagNameConflict: false,
  },
};

describe('Save Sets Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle togglePendingCreate', () => {
    expect(reducer(initialState, togglePendingCreate(true))).toEqual({
      create: {
        isLoading: true,
        error: null,
        tagNameConflict: false,
      },
    });
  });

  it('should handle a tag name conflict', () => {
    expect(reducer(initialState, toggleTagNameExist(true))).toEqual({
      create: {
        isLoading: false,
        error: null,
        tagNameConflict: true,
      },
    });
  });

  it('should handle failure create', () => {
    expect(reducer(initialState, failureCreate(new Error('error')))).toEqual({
      create: {
        isLoading: false,
        error: new Error('error'),
        tagNameConflict: false,
      },
    });
  });

  it('should handle re-initialize state', () => {
    const state = {
      create: {
        isLoading: false,
        error: null,
        tagNameConflict: true,
      },
    };
    expect(reducer(state, reInitializeSaveSetsState())).toEqual(initialState);
  });
});
