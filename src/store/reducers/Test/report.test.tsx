import { Action } from 'redux';

import {
  clearMessage,
  failure,
  reInitializeState,
  requestMessage,
  toggleLoading,
} from 'store/actionCreators/report';
import { MessageType } from 'store/reportTypes';

import reducer from '../report';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState = {
  isLoading: false,
  error: null,
  message: null,
};

describe('Report Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle toggle loading', () => {
    expect(reducer(undefined, toggleLoading(true))).toEqual({
      isLoading: true,
      error: null,
      message: null,
    });
  });

  it('should handle request message', () => {
    const msg = {
      content: 'Please wait while we check availability',
      duration: 0,
      type: MessageType.LOADING,
    };
    expect(reducer(undefined, requestMessage(msg))).toEqual({
      isLoading: false,
      error: null,
      message: msg,
    });
  });

  it('should handle failure', () => {
    expect(reducer(undefined, failure(new Error('error')))).toEqual({
      isLoading: false,
      error: new Error('error'),
      message: null,
    });
  });

  it('should handle clear message', () => {
    const state = {
      isLoading: false,
      error: null,
      message: {
        content: 'Please wait while we check availability',
        duration: 0,
        type: MessageType.LOADING,
      },
    };
    expect(reducer(state, clearMessage())).toEqual({
      isLoading: false,
      error: null,
      message: null,
    });
  });

  it('should handle re initialize state', () => {
    const state = {
      isLoading: true,
      error: null,
      message: {
        content: 'Please wait while we check availability',
        duration: 0,
        type: MessageType.LOADING,
      },
    };
    expect(reducer(state, reInitializeState())).toEqual(initialState);
  });
});
