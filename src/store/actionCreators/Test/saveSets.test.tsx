import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  createSet,
  deleteSets,
  getSetAndParticipantsCountByUser,
  setCountForTag,
  updateSet,
} from 'services/sets';
import {
  addRemoveSetIds,
  addSetToCurrentQuery,
  createSetIfUnique,
  createSetQueryInCohortBuilder,
  deleteUserSets,
  editSetTag,
  failureCreate,
  fetchSetsIfNeeded,
  getUserSets,
  isLoadingCreateSet,
  reInitializeSetsState,
} from 'store/actionCreators/saveSets';
import { Api } from 'store/apiTypes';
import {
  DeleteSetParams,
  EditSetTagParams,
  SetNameConflictError,
  SetsActions,
  SetSubActionTypes,
} from 'store/saveSetTypes';
import { AddRemoveSetParams, SetInfo } from 'store/saveSetTypes';

console.error = jest.fn();

jest.mock('services/api');
jest.mock('services/sets');
jest.mock('@kfarranger/components/dist/utils/saveSet');

describe('Save Sets actions', () => {
  it('should create an action when error', () => {
    const error = new Error('a network error');

    const expectedAction = {
      type: SetsActions.FAILURE_CREATE,
      error,
    };
    expect(failureCreate(error)).toEqual(expectedAction);
  });

  it('should create an action to toggle loader', () => {
    const isPending = true;

    const expectedAction = {
      type: SetsActions.TOGGLE_PENDING_CREATE,
      isPending,
    };
    expect(isLoadingCreateSet(isPending)).toEqual(expectedAction);
  });

  it('should create an action to re initialize state', () => {
    const expectedAction = {
      type: SetsActions.RE_INITIALIZE_STATE,
    };
    expect(reInitializeSetsState()).toEqual(expectedAction);
  });
});

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const mockApi: jest.Mocked<Api> = {
  // @ts-ignore just a mock to call the api - no need add complex types.
  api: () => {},
};

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
    (createSet as jest.Mock).mockReset();
  });

  it('should generate the correct flow when creating a saveSet', async () => {
    (setCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(0));
    (createSet as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: { saveSet: { setId: 'set2', size: 1, tag: 'newSet' }, errors: [] } }),
    );

    const expectedActions = [
      { type: SetsActions.TOGGLE_PENDING_CREATE, isPending: true },
      { type: SetsActions.TOGGLE_PENDING_CREATE, isPending: false },
      { type: SetsActions.TOGGLE_PENDING_CREATE, isPending: true },
      {
        type: SetsActions.USER_SAVE_SETS,
        payload: [
          {
            setId: 'set1',
            size: 12,
            tag: 'set',
          },
          {
            setId: 'set2',
            size: 1,
            tag: 'newSet',
          },
        ],
      },
      { type: SetsActions.TOGGLE_PENDING_CREATE, isPending: false },
    ];
    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
        userSets: {
          sets: [{ setId: 'set1', size: 12, tag: 'set' }],
          error: null,
          isLoading: false,
          isDeleting: false,
          isEditing: false,
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
      { type: SetsActions.TOGGLE_PENDING_CREATE, isPending: true },
      {
        type: SetsActions.FAILURE_CREATE,
        error: new SetNameConflictError('A set with this name already exists'),
      },
      { type: SetsActions.TOGGLE_PENDING_CREATE, isPending: false },
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
      { type: SetsActions.TOGGLE_PENDING_CREATE, isPending: true },
      { type: SetsActions.FAILURE_CREATE, error: new Error('error') },
      { type: SetsActions.TOGGLE_PENDING_CREATE, isPending: false },
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
      { type: SetsActions.TOGGLE_LOADING_SAVE_SETS, isLoading: true },
      { type: SetsActions.USER_SAVE_SETS, payload: [] },
      { type: SetsActions.TOGGLE_LOADING_SAVE_SETS, isLoading: false },
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
      { type: SetsActions.TOGGLE_IS_DELETING_SAVE_SETS, isDeleting: true },
      { type: SetsActions.REMOVE_USER_SAVE_SETS, sets: ['setId1'] },
      { type: SetsActions.TOGGLE_IS_DELETING_SAVE_SETS, isDeleting: false },
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

    const payload = { setIds: ['setId1'], onFail: () => {} } as DeleteSetParams;

    // @ts-ignore
    await store.dispatch(deleteUserSets(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow editing save sets tag ', async () => {
    (setCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(0));
    (updateSet as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ updatedResults: 1, setSize: 12 }),
    );
    const set = { key: 'set1', name: 'thisSet', currentUser: 'thisUser' } as SetInfo;
    const expectedActions = [{ type: SetsActions.EDIT_SAVE_SET_TAG, set: set }];

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
    await store.dispatch(editSetTag(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow adding/deleting participant to tag ', async () => {
    (setCountForTag as jest.Mock).mockImplementationOnce(() => Promise.resolve(0));
    (updateSet as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ updatedResults: 1, setSize: 12 }),
    );
    const expectedActions = [
      { type: SetsActions.TOGGLE_IS_ADD_DELETE_TO_SET, isEditing: true },
      {
        type: SetsActions.USER_SAVE_SETS,
        payload: [
          { setId: 'set1', size: 12, tag: 'set1' },
          { setId: 'set2', size: 5, tag: 'set2' },
        ],
      },
      { type: SetsActions.TOGGLE_IS_ADD_DELETE_TO_SET, isEditing: false },
    ];

    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
        userSets: {
          sets: [
            { setId: 'set1', size: 5, tag: 'set1' },
            { setId: 'set2', size: 5, tag: 'set2' },
          ],
          isLoading: false,
          error: false,
          isDeleting: false,
          isEditing: false,
        },
      },
    });

    const payload: AddRemoveSetParams = {
      userId: 'user1',
      setId: 'set1',
      onSuccess: () => {},
      onFail: () => {},
      subActionType: SetSubActionTypes.ADD_IDS,
      sqon: { op: 'and', content: [] },
      type: 'type',
      path: 'path',
    };

    // @ts-ignore
    await store.dispatch(addRemoveSetIds(payload));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should not fetch sets if sets already in store ', async () => {
    const expectedActions: any[] = [];
    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
        userSets: {
          sets: [
            { setId: 'set1', size: 5, tag: 'set1' },
            { setId: 'set2', size: 5, tag: 'set2' },
          ],
          isLoading: false,
          error: false,
          isDeleting: false,
          isEditing: false,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(fetchSetsIfNeeded(mockApi));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should fetch sets if not sets in store', async () => {
    (getSetAndParticipantsCountByUser as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve([]),
    );
    const expectedActions = [
      { type: SetsActions.TOGGLE_LOADING_SAVE_SETS, isLoading: true },
      { type: SetsActions.USER_SAVE_SETS, payload: [] },
      { type: SetsActions.TOGGLE_LOADING_SAVE_SETS, isLoading: false },
    ];
    const store = mockStore({
      saveSets: {
        create: {
          isLoading: false,
          error: null,
          tagNameConflict: false,
        },
        userSets: {
          sets: [],
          isLoading: false,
          error: false,
          isDeleting: false,
          isEditing: false,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(fetchSetsIfNeeded(mockApi));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow when request to create query in cohort ', async () => {
    const setId = '1234';
    const expectedActions = [{ type: SetsActions.CREATE_SET_QUERY_REQUEST, setId }];
    const store = mockStore({
      sqons: [
        {
          op: 'and',
          content: [{ op: 'in', content: { field: 'kf_id', value: 'set_id:id12345' } }],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      areSqonsEmpty: false,
      isLoading: false,
      error: null,
    });

    // @ts-ignore
    await store.dispatch(createSetQueryInCohortBuilder(setId));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate the correct flow when request to add set sqon query in cohort ', async () => {
    const setId = '1234';
    const expectedActions = [{ type: SetsActions.ADD_SET_TO_CURRENT_QUERY, setId }];
    const store = mockStore({
      sqons: [
        {
          op: 'and',
          content: [{ op: 'in', content: { field: 'kf_id', value: 'set_id:id12345' } }],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      areSqonsEmpty: false,
      isLoading: false,
      error: null,
    });

    // @ts-ignore
    await store.dispatch(addSetToCurrentQuery(setId));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
