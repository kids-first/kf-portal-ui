import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  createSaveSetIfUnique,
  deleteUserSaveSets,
  failureCreate,
  getUserSaveSets,
  isLoadingCreateSaveSet,
  reInitializeSaveSetsState,
} from '../saveSets';
import {
  FAILURE_CREATE,
  RE_INITIALIZE_STATE,
  REMOVE_USER_SAVE_SETS,
  SaveSetNameConflictError,
  TOGGLE_IS_DELETING_SAVE_SETS,
  TOGGLE_LOADING_SAVE_SETS,
  TOGGLE_PENDING_CREATE,
  USER_SAVE_SETS,
} from 'store/saveSetTypes';
import { deleteSaveSet, getSetAndParticipantsCountByUser, saveSetCountForTag } from 'services/sets';
console.error = jest.fn();

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
    (deleteSaveSet as jest.Mock).mockReset();
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

  it('should generate the correct flow deleting save sets', async () => {
    (deleteSaveSet as jest.Mock).mockImplementationOnce(() => Promise.resolve(1));
    const expectedActions = [
      { type: TOGGLE_IS_DELETING_SAVE_SETS, isDeleting: true },
      { type: REMOVE_USER_SAVE_SETS, sets: ['setId1'] },
      { type: TOGGLE_IS_DELETING_SAVE_SETS, isDeleting: false },
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
          isDeleting: false,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(deleteUserSaveSets('userid', ['setId1']));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow for partial success deleting save sets', async () => {
    (deleteSaveSet as jest.Mock).mockImplementationOnce(() => Promise.resolve(1));
    (getSetAndParticipantsCountByUser as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve([]),
    );
    const expectedActions = [
      { type: TOGGLE_IS_DELETING_SAVE_SETS, isDeleting: true },
      { type: USER_SAVE_SETS, payload: [] },
      { type: TOGGLE_IS_DELETING_SAVE_SETS, isDeleting: false },
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
          isDeleting: false,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(deleteUserSaveSets('userid', ['setId1', 'setId2']));
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should generate the correct flow complete fail deleting save sets', async () => {
    (deleteSaveSet as jest.Mock).mockImplementationOnce(() => Promise.resolve(0));
    const expectedActions = [
      { type: TOGGLE_IS_DELETING_SAVE_SETS, isDeleting: true },
      { type: TOGGLE_IS_DELETING_SAVE_SETS, isDeleting: false },
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
          isDeleting: false,
        },
      },
    });

    const consoleSpy = jest.spyOn(console, 'error');

    // @ts-ignore
    await store.dispatch(deleteUserSaveSets('userid', ['setId1', 'setId2']));
    expect(consoleSpy).toHaveBeenCalledWith('Nothing was deleted');
    expect(store.getActions()).toEqual(expectedActions);
  });
});
