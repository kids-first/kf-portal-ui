import reducer from '../saveSets';
import { Action } from 'redux';
import {
  failureCreate,
  reInitializeSaveSetsState,
  isLoadingCreateSaveSet,
} from '../../actionCreators/saveSets';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState = {
  create: {
    isLoading: false,
    error: null,
  },
};

describe('Save Sets Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle togglePendingCreate', () => {
    expect(reducer(initialState, isLoadingCreateSaveSet(true))).toEqual({
      create: {
        isLoading: true,
        error: null,
      },
    });
  });

  it('should handle failure create', () => {
    expect(reducer(initialState, failureCreate(new Error('error')))).toEqual({
      create: {
        isLoading: false,
        error: new Error('error'),
      },
    });
  });

  it('should handle re-initialize state', () => {
    const state = {
      create: {
        isLoading: true,
        error: Error('Some Error'),
      },
    };
    expect(reducer(state, reInitializeSaveSetsState())).toEqual(initialState);
  });
});
