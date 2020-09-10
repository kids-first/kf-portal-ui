import reducer from '../saveSets';
import { Action } from 'redux';
import {
  failureCreate,
  reInitializeSetsState,
  isLoadingCreateSet,
  isLoadingSets,
  isDeletingSets,
  isEditingTag,
} from '../../actionCreators/saveSets';
import { SetInfo } from 'components/UserDashboard/ParticipantSets';

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
      },
    });
  });

  it('should handle editing save sets tag', () => {
    const set = {
      key: '1234',
      name: 'someSet',
      currentUser: 'me',
    } as SetInfo;

    expect(reducer(initialState, isEditingTag(set))).toEqual({
      create: {
        isLoading: false,
        error: null,
      },
      userSets: {
        sets: [],
        error: null,
        isLoading: false,
        isDeleting: false,
      },
    });
  });
});
