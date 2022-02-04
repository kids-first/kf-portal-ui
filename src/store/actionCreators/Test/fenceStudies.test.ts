import { AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getAuthStudiesIdAndCount, getStudiesCountByNameAndAcl } from 'services/fenceStudies';
import { ConnectionStatus } from 'store/connectionTypes';
import {
  DispatchFenceStudies,
  FenceStudiesActions,
  FenceStudiesState,
} from 'store/fenceStudiesTypes';
import { FenceName } from 'store/fenceTypes';

import {
  addFenceStudies,
  computeAllFencesAuthStudies,
  fetchFenceStudies,
  fetchFenceStudiesIfNeeded,
  OPEN_ACCESS,
  removeFenceStudies,
  toggleIsFetchingAllFenceStudies,
} from '../fenceStudies';

import {
  MOCK_AUTH_STUDIES_FROM_GEN3,
  MOCK_AUTH_STUDIES_WITH_2_FENCES,
  MOCK_STUDIES_IDS_AND_COUNTS,
  mockApi,
} from './mockDataFence';

const NO_ACTIONS: AnyAction[] = [];

const middleware = [thunk];

type StateSliceNeeded = {
  fenceStudies: FenceStudiesState;
};

const mockStore = createMockStore<StateSliceNeeded, DispatchFenceStudies>(middleware);

jest.mock('services/fenceStudies');

const initialState = {
  fenceStudies: {
    fenceStudies: {},
    loadingStudiesForFences: [],
    statuses: {
      [FenceName.gen3]: ConnectionStatus.unknown,
      [FenceName.dcf]: ConnectionStatus.unknown,
    },
  },
};

describe('Fence Studies actions', () => {
  beforeEach(() => {
    console.error = jest.fn();
    (getAuthStudiesIdAndCount as jest.Mock).mockReset();
    (getStudiesCountByNameAndAcl as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an action to toggle all fence studies', () => {
    const expectedAction = {
      type: FenceStudiesActions.toggleIsFetchingAllFenceStudies,
      isLoading: true,
    };
    expect(toggleIsFetchingAllFenceStudies(true)).toEqual(expectedAction);
  });

  it('should create an action when removing a fence studies', () => {
    const expectedAction = {
      type: FenceStudiesActions.removeFenceStudies,
      fenceName: FenceName.dcf,
    };
    expect(removeFenceStudies(FenceName.dcf)).toEqual(expectedAction);
  });

  it('should transform auth studies adequately', () => {
    expect(computeAllFencesAuthStudies(MOCK_AUTH_STUDIES_WITH_2_FENCES)).toEqual([
      {
        acl: [OPEN_ACCESS],
        authorizedFiles: 5239,
        id: `${FenceName.gen3}_1`,
        studyShortName: `studyShortName_${FenceName.gen3}_1`,
        totalFiles: 19791,
      },
      {
        acl: [OPEN_ACCESS],
        authorizedFiles: 5239,
        id: `${FenceName.dcf}_1`,
        studyShortName: `studyShortName_${FenceName.dcf}_1`,
        totalFiles: 19791,
      },
    ]);
  });

  it('should create an action to add a fence studies', () => {
    const expectedAction = {
      type: FenceStudiesActions.addFenceStudies,
      fenceAuthorizedStudies: MOCK_AUTH_STUDIES_WITH_2_FENCES,
    };
    expect(addFenceStudies(MOCK_AUTH_STUDIES_WITH_2_FENCES)).toEqual(expectedAction);
  });

  it('should fetch fence studies when user is adequately connected to a data repository', async () => {
    (getAuthStudiesIdAndCount as jest.Mock).mockImplementation(() =>
      Promise.resolve(MOCK_STUDIES_IDS_AND_COUNTS),
    );
    (getStudiesCountByNameAndAcl as jest.Mock).mockImplementation(() =>
      Promise.resolve(MOCK_AUTH_STUDIES_FROM_GEN3),
    );
    const store = mockStore(initialState);

    const dispatch: DispatchFenceStudies = store.dispatch;

    await dispatch(fetchFenceStudies(mockApi, FenceName.gen3, []));

    const expectedActions = [
      {
        type: FenceStudiesActions.toggleIsFetchingOneFenceStudies,
        isLoading: true,
        fenceName: FenceName.gen3,
      },
      {
        type: FenceStudiesActions.addFenceStudies,
        fenceAuthorizedStudies: {
          [FenceName.gen3]: { authorizedStudies: MOCK_AUTH_STUDIES_FROM_GEN3 },
        },
      },
      {
        type: FenceStudiesActions.addStudiesConnectionStatus,
        fenceName: FenceName.gen3,
        newStatus: ConnectionStatus.connected,
      },
      {
        type: FenceStudiesActions.toggleIsFetchingOneFenceStudies,
        isLoading: false,
        fenceName: FenceName.gen3,
      },
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should add a disconnected status if an error occurred while fetching studies', async () => {
    (getAuthStudiesIdAndCount as jest.Mock).mockImplementation(() => Promise.reject('Bam!'));
    const store = mockStore(initialState);

    const dispatch: DispatchFenceStudies = store.dispatch;

    await dispatch(fetchFenceStudies(mockApi, FenceName.gen3, []));

    const expectedActions = [
      {
        type: FenceStudiesActions.toggleIsFetchingOneFenceStudies,
        isLoading: true,
        fenceName: FenceName.gen3,
      },
      {
        type: FenceStudiesActions.addStudiesConnectionStatus,
        fenceName: FenceName.gen3,
        newStatus: ConnectionStatus.disconnected,
      },
      {
        type: FenceStudiesActions.toggleIsFetchingOneFenceStudies,
        isLoading: false,
        fenceName: FenceName.gen3,
      },
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should not fetch fence studies if user has already has connection for particular fence', async () => {
    const store = mockStore({
      fenceStudies: {
        fenceStudies: MOCK_AUTH_STUDIES_WITH_2_FENCES,
        loadingStudiesForFences: [],
        statuses: {
          [FenceName.gen3]: ConnectionStatus.connected,
          [FenceName.dcf]: ConnectionStatus.connected,
        },
      },
    });

    const dispatch: DispatchFenceStudies = store.dispatch;

    await dispatch(
      fetchFenceStudiesIfNeeded(mockApi, FenceName.gen3, { [FenceName.gen3]: ['phs'] }),
    );

    expect(store.getActions()).toEqual(NO_ACTIONS);
  });
});
