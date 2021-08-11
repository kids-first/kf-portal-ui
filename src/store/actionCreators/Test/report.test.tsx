import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import generateReport, { checkAvailability, shouldCheckAvailability } from 'services/report';
import { MessageType, ReportActions } from 'store/reportTypes';

import {
  clearMessage,
  failure,
  fetchReport,
  fetchReportIfNeeded,
  reInitializeState,
  requestMessage,
  toggleLoading,
} from '../report';

describe('Report actions', () => {
  it('should create an action to request a message', () => {
    const message = {
      content: `This report is not available`,
      duration: 3.5,
      type: MessageType.WARN,
    };

    const expectedAction = {
      type: ReportActions.REQUEST_MESSAGE,
      message,
    };
    expect(requestMessage(message)).toEqual(expectedAction);
  });

  it('should create an action when error', () => {
    const error = new Error('a network error');

    const expectedAction = {
      type: ReportActions.FAILURE,
      error,
    };
    expect(failure(error)).toEqual(expectedAction);
  });

  it('should create an action to toggle loader', () => {
    const isLoading = true;

    const expectedAction = {
      type: ReportActions.TOGGLE_LOADING,
      isLoading,
    };
    expect(toggleLoading(isLoading)).toEqual(expectedAction);
  });

  it('should create an action to re initialize state', () => {
    const expectedAction = {
      type: ReportActions.RE_INITIALIZE_STATE,
    };
    expect(reInitializeState()).toEqual(expectedAction);
  });

  it('should create an action to clear a message', () => {
    const expectedAction = {
      type: ReportActions.CLEAR_MESSAGE,
    };
    expect(clearMessage()).toEqual(expectedAction);
  });
});

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('services/report');

describe('fetchReport', () => {
  beforeEach(() => {
    (generateReport as jest.Mock).mockReset();
  });

  it('should generate the correct flow when successfully generating a report', async () => {
    (generateReport as jest.Mock).mockImplementation(() => Promise.resolve());
    const expectedActions = [
      { type: ReportActions.TOGGLE_LOADING, isLoading: true },
      {
        type: ReportActions.REQUEST_MESSAGE,
        message: {
          content: 'Please wait while we generate your report',
          duration: 0,
          type: MessageType.LOADING,
        },
      },
      { type: ReportActions.CLEAR_MESSAGE },
      { type: ReportActions.TOGGLE_LOADING, isLoading: false },
    ];
    const store = mockStore({
      report: {
        isLoading: false,
        message: null,
        error: null,
      },
    });

    // @ts-ignore
    await store.dispatch(fetchReport({ sqon: { op: 'and', content: [] }, name: 'none' }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate an error when unsuccessfully generating a report', async () => {
    (generateReport as jest.Mock).mockImplementation(() => Promise.reject('error'));
    const expectedActions = [
      { type: ReportActions.TOGGLE_LOADING, isLoading: true },
      {
        type: ReportActions.REQUEST_MESSAGE,
        message: {
          content: 'Please wait while we generate your report',
          duration: 0,
          type: MessageType.LOADING,
        },
      },
      { type: ReportActions.CLEAR_MESSAGE },
      { type: ReportActions.FAILURE, error: 'error' },
      { type: ReportActions.TOGGLE_LOADING, isLoading: false },
    ];
    const store = mockStore({
      report: {
        isLoading: false,
        message: null,
        error: null,
      },
    });

    // @ts-ignore
    await store.dispatch(fetchReport({ sqon: { op: 'and', content: [] }, name: 'none' }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('fetchReportIfNeeded', () => {
  beforeEach(() => {
    (generateReport as jest.Mock).mockReset();
    (shouldCheckAvailability as jest.Mock).mockReset();
    (checkAvailability as jest.Mock).mockReset();
  });

  it('should not generate a report if it is not available', async () => {
    (shouldCheckAvailability as jest.Mock).mockImplementation(() => true);
    (checkAvailability as jest.Mock).mockImplementation(() => false);
    const expectedActions = [
      { type: ReportActions.TOGGLE_LOADING, isLoading: true },
      {
        type: ReportActions.REQUEST_MESSAGE,
        message: {
          content: 'Checking for availability',
          duration: 0,
          type: MessageType.LOADING,
        },
      },
      { type: ReportActions.CLEAR_MESSAGE },
      {
        type: ReportActions.REQUEST_MESSAGE,
        message: {
          content: `This report is not available`,
          duration: 3.5,
          type: MessageType.WARN,
        },
      },
      { type: ReportActions.TOGGLE_LOADING, isLoading: false },
    ];
    const store = mockStore({
      report: {
        isLoading: false,
        message: null,
        error: null,
      },
    });

    // @ts-ignore
    await store.dispatch(fetchReportIfNeeded({ sqon: { op: 'and', content: [] }, name: 'none' }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should have the correct flow when checking for availability', async () => {
    (shouldCheckAvailability as jest.Mock).mockImplementation(() => true);
    (checkAvailability as jest.Mock).mockImplementation(() => true);
    const expectedActions = [
      { type: ReportActions.TOGGLE_LOADING, isLoading: true },
      {
        type: ReportActions.REQUEST_MESSAGE,
        message: {
          content: 'Checking for availability',
          duration: 0,
          type: MessageType.LOADING,
        },
      },
      { type: ReportActions.CLEAR_MESSAGE },
      { type: ReportActions.TOGGLE_LOADING, isLoading: false },
      { type: ReportActions.TOGGLE_LOADING, isLoading: true },
      {
        type: ReportActions.REQUEST_MESSAGE,
        message: {
          content: 'Please wait while we generate your report',
          duration: 0,
          type: MessageType.LOADING,
        },
      },
      { type: ReportActions.CLEAR_MESSAGE },
      { type: ReportActions.TOGGLE_LOADING, isLoading: false },
    ];
    const store = mockStore({
      report: {
        isLoading: false,
        message: null,
        error: null,
      },
    });

    // @ts-ignore
    await store.dispatch(fetchReportIfNeeded({ sqon: { op: 'and', content: [] }, name: 'none' }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
