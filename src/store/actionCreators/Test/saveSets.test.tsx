import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  createSaveSetIfUnique,
  failureCreate,
  getDefaultTag,
  getUserSaveSets,
  isLoadingCreateSaveSet,
  reInitializeSaveSetsState,
} from '../saveSets';
import {
  FAILURE_CREATE,
  RE_INITIALIZE_STATE,
  SaveSetNameConflictError,
  TOGGLE_LOADING_SAVE_SETS,
  TOGGLE_PENDING_CREATE,
  USER_DEFAULT_TAG,
  USER_SAVE_SETS,
} from 'store/saveSetTypes';
import { getSetAndParticipantsCountByUser, saveSetCountForTag } from 'services/sets';

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
    expect(isLoadingCreateSaveSet(isPending)).toEqual(expectedAction);
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
    await store.dispatch(createSaveSetIfUnique(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow when creating a saveSet and has a name conflict', async () => {
    (saveSetCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(1));
    const expectedActions = [
      { type: TOGGLE_PENDING_CREATE, isPending: true },
      {
        type: FAILURE_CREATE,
        error: new SaveSetNameConflictError('A set with this name already exists'),
      },
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
    await store.dispatch(createSaveSetIfUnique(payload));
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
    await store.dispatch(createSaveSetIfUnique(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow fetching save sets for a user', async () => {
    (getSetAndParticipantsCountByUser as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve([]),
    );
    const expectedActions = [
      { type: TOGGLE_LOADING_SAVE_SETS, isLoading: true },
      { type: USER_SAVE_SETS, payload: [] },
      { type: TOGGLE_LOADING_SAVE_SETS, isLoading: false },
    ];
    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
        userSets: {
          isLoading: false,
          sets: [],
          error: false,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(getUserSaveSets('userid'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return next default saved set tag name', async () => {
    const mockReturn = [
      {
        node: {
          setId: 1,
          count: 1,
          tag: 'SAVED_SET_1',
        },
      },
      {
        node: {
          setId: 2,
          count: 1,
          tag: 'saved_set_3',
        },
      },
      {
        node: {
          setId: 3,
          count: 1,
          tag: 'toto-name_4',
        },
      },
      {
        node: {
          setId: 4,
          count: 1,
          tag: 'Saved_set_4',
        },
      },
    ];
    (getSetAndParticipantsCountByUser as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockReturn),
    );
    const expectedActions = [
      { type: TOGGLE_LOADING_SAVE_SETS, isLoading: true },
      { type: USER_DEFAULT_TAG, payload: 'Saved_Set_5' },
      { type: TOGGLE_LOADING_SAVE_SETS, isLoading: false },
    ];
    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
        userSets: {
          isLoading: false,
          sets: [],
          error: false,
        },
      },
    });

    getDefaultTag('userId');

    // @ts-ignore
    await store.dispatch(getDefaultTag('userid'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return 1st default saved set tag name if none already exists', async () => {
    const mockReturn = [
      {
        node: {
          setId: 3,
          count: 1,
          tag: 'toto-name_4',
        },
      },
      {
        node: {
          setId: 3,
          count: 1,
          tag: 'tutu-name_1',
        },
      },
    ];
    (getSetAndParticipantsCountByUser as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockReturn),
    );
    const expectedActions = [
      { type: TOGGLE_LOADING_SAVE_SETS, isLoading: true },
      { type: USER_DEFAULT_TAG, payload: 'Saved_Set_1' },
      { type: TOGGLE_LOADING_SAVE_SETS, isLoading: false },
    ];
    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
        userSets: {
          isLoading: false,
          sets: [],
          error: false,
        },
      },
    });

    getDefaultTag('userId');

    // @ts-ignore
    await store.dispatch(getDefaultTag('userid'));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
