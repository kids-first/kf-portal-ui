import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  createSetIfUnique,
  deleteUserSets,
  editSaveSet,
  failureCreate,
  getUserSets,
  isLoadingCreateSet,
  reInitializeSetsState,
} from '../saveSets';
import {
  DeleteSetParams,
  EDIT_SAVE_SET_TAG,
  EditSetTagParams,
  FAILURE_CREATE,
  RE_INITIALIZE_STATE,
  REMOVE_USER_SAVE_SETS,
  SetNameConflictError,
  TOGGLE_IS_DELETING_SAVE_SETS,
  TOGGLE_LOADING_SAVE_SETS,
  TOGGLE_PENDING_CREATE,
  USER_SAVE_SETS,
} from 'store/saveSetTypes';
import {
  deleteSets,
  editSaveSetTag,
  getSetAndParticipantsCountByUser,
  setCountForTag,
} from 'services/sets';
// @ts-ignore
import saveSet from '@kfarranger/components/dist/utils/saveSet';
import { SetInfo } from 'components/UserDashboard/ParticipantSets';
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
    expect(isLoadingCreateSet(isPending)).toEqual(expectedAction);
  });

  it('should create an action to re initialize state', () => {
    const expectedAction = {
      type: RE_INITIALIZE_STATE,
    };
    expect(reInitializeSetsState()).toEqual(expectedAction);
  });
});

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('services/sets');
jest.mock('@kfarranger/components/dist/utils/saveSet');

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
    (setCountForTag as jest.Mock).mockReset();
    (deleteSets as jest.Mock).mockReset();
    (saveSet as jest.Mock).mockReset();
  });

  it('should generate the correct flow when creating a saveSet', async () => {
    (setCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(0));
    (saveSet as jest.Mock).mockImplementationOnce(() => Promise.resolve());
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
    await store.dispatch(createSetIfUnique(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow when creating a saveSet and has a name conflict', async () => {
    (setCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(1));
    const expectedActions = [
      { type: TOGGLE_PENDING_CREATE, isPending: true },
      {
        type: FAILURE_CREATE,
        error: new SetNameConflictError('A set with this name already exists'),
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
    await store.dispatch(createSetIfUnique(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate an error when creating a save set is unsuccessful', async () => {
    (setCountForTag as jest.Mock).mockImplementation(() => {
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
    await store.dispatch(createSetIfUnique(payload));
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
    await store.dispatch(getUserSets('userid'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow deleting save sets', async () => {
    (deleteSets as jest.Mock).mockImplementationOnce(() => Promise.resolve(1));
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

    const payload = { userId: 'userId', setIds: ['setId1'], onFail: () => {} } as DeleteSetParams;

    // @ts-ignore
    await store.dispatch(deleteUserSets(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow editing save sets tag ', async () => {
    (setCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(0));
    (editSaveSetTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(12));
    const set = { key: 'set1', name: 'thisSet', currentUser: 'thisUser' } as SetInfo;
    const expectedActions = [{ type: EDIT_SAVE_SET_TAG, set: set }];

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

    const payload = {
      setInfo: set,
      onSuccess: () => {},
      onFail: () => {},
      onNameConflict: () => {},
    } as EditSetTagParams;

    // @ts-ignore
    await store.dispatch(editSaveSet(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
