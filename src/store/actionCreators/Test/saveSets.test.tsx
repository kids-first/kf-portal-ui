import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  createSaveSet,
  failureCreate,
  reInitializeSaveSetsState,
  togglePendingCreate,
  toggleTagNameExist,
} from '../saveSets';
import {
  FAILURE_CREATE,
  RE_INITIALIZE_STATE,
  TAG_NAME_CONFLICT,
  TOGGLE_PENDING_CREATE,
} from 'store/saveSetTypes';
import { saveSetCountForTag } from 'services/sets';

describe('Save Sets actions', () => {
  it('should create an action when error', () => {
    const error = new Error('a network error');

    const expectedAction = {
      type: FAILURE_CREATE,
      error,
    };
    expect(failureCreate(error)).toEqual(expectedAction);
  });

  it('should create an action to toggle loader', () => {
    const isPending = true;

    const expectedAction = {
      type: TOGGLE_PENDING_CREATE,
      isPending,
    };
    expect(togglePendingCreate(isPending)).toEqual(expectedAction);
  });

  it('should create an action when a tag name conflict', () => {
    const hasSameTagName = true;

    const expectedAction = {
      type: TAG_NAME_CONFLICT,
      hasSameTagName,
    };
    expect(toggleTagNameExist(hasSameTagName)).toEqual(expectedAction);
  });

  it('should create an action to re initialize state', () => {
    const expectedAction = {
      type: RE_INITIALIZE_STATE,
    };
    expect(reInitializeSaveSetsState()).toEqual(expectedAction);
  });
});

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('services/sets');

const payload = {
  onSuccess: () => {},
  onNameConflict: () => {},
  tag: 'tagName',
  api: () => {},
  userId: 'user1',
  sqon: { op: 'and', content: { field: 'setId', value: '' } },
};

describe('createSaveSet', () => {
  beforeEach(() => {
    (saveSetCountForTag as jest.Mock).mockReset();
  });

  it('should generate the correct flow when creating a saveSet', async () => {
    (saveSetCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(0));
    const expectedActions = [
      { type: TOGGLE_PENDING_CREATE, isPending: true },
      { type: TOGGLE_PENDING_CREATE, isPending: false },
    ];
    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(createSaveSet(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow when creating a saveSet and has a name conflict', async () => {
    (saveSetCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(1));
    const expectedActions = [
      { type: TOGGLE_PENDING_CREATE, isPending: true },
      { type: TAG_NAME_CONFLICT, hasSameTagName: true },
      { type: TOGGLE_PENDING_CREATE, isPending: false },
    ];
    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(createSaveSet(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate an error when creating a save set is unsuccessful', async () => {
    (saveSetCountForTag as jest.Mock).mockImplementation(() => {
      throw new Error('error');
    });
    const expectedActions = [
      { type: TOGGLE_PENDING_CREATE, isPending: true },
      { type: FAILURE_CREATE, error: new Error('error') },
      { type: TOGGLE_PENDING_CREATE, isPending: false },
    ];
    const store = mockStore({
      saveSets: {
        create: {
          isPending: false,
          error: null,
          tagNameConflict: false,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(createSaveSet(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
