import { AnyAction } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getFenceUser } from 'services/fence';
import {
  DispatchFenceConnections,
  FenceConnectionsActions,
  FenceName,
} from 'store/fenceConnectionsTypes';

import {
  computeAclsByFence,
  computeAclsForConnection,
  concatAllFencesAcls,
  fetchAllFencesConnectionsIfNeeded,
  fetchFencesConnections,
  fetchFencesConnectionsIfNeeded,
  removeFenceConnection,
  toggleIsFetchingAllFenceConnections,
} from '../fenceConnections';

import { MOCK_FENCE_CONNECTIONS, MOCK_GEN3_CONNECTION, mockApi } from './mockDataFence';

const DCF = FenceName.dcf;
const GEN3 = FenceName.gen3;

const NO_ACTIONS: AnyAction[] = [];

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('services/fence');

describe('Fence Connections actions', () => {
  beforeEach(() => {
    (getFenceUser as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an action to toggle all fence connections', () => {
    const expectedAction = {
      type: FenceConnectionsActions.toggleIsFetchingAllFenceConnections,
      isLoading: true,
    };
    expect(toggleIsFetchingAllFenceConnections(true)).toEqual(expectedAction);
  });

  it('should create an action when removing a fence connection', () => {
    const expectedAction = {
      type: FenceConnectionsActions.removeFenceConnection,
      fenceName: DCF,
    };
    expect(removeFenceConnection(DCF)).toEqual(expectedAction);
  });

  it('should manage acls adequately', () => {
    expect(concatAllFencesAcls(MOCK_FENCE_CONNECTIONS)).toEqual(['a', 'b', 'c', 'x', 'y', 'z']);
    expect(computeAclsForConnection(MOCK_FENCE_CONNECTIONS[GEN3])).toEqual(['a', 'b', 'c']);
    expect(computeAclsByFence(MOCK_FENCE_CONNECTIONS)).toEqual({
      [GEN3]: ['a', 'b', 'c'],
      [DCF]: ['x', 'y', 'z'],
    });
  });

  it('should fetch fence connections when user is adequately connected to a data repository', async () => {
    (getFenceUser as jest.Mock).mockImplementation(() => Promise.resolve(MOCK_GEN3_CONNECTION));
    const store = mockStore({
      fenceConnections: {
        fenceConnections: {},
        isFetchingAllFenceConnections: false,
      },
    });

    const dispatch: DispatchFenceConnections = store.dispatch;

    await dispatch(fetchFencesConnections(mockApi, GEN3));

    const expectedActions = [
      {
        type: FenceConnectionsActions.addFenceConnection,
        fenceName: GEN3,
        connection: MOCK_GEN3_CONNECTION,
      },
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });

  it(
    'should not fetch fence connections if user has' +
      ' already has connection for particular fence',
    async () => {
      (getFenceUser as jest.Mock).mockImplementation(() => Promise.resolve(MOCK_GEN3_CONNECTION));

      const store = mockStore({
        fenceConnections: {
          fenceConnections: { [GEN3]: MOCK_GEN3_CONNECTION },
          isFetchingAllFenceConnections: false,
        },
      });

      const dispatch: DispatchFenceConnections = store.dispatch;

      await dispatch(fetchFencesConnectionsIfNeeded(mockApi, GEN3));

      expect(store.getActions()).toEqual(NO_ACTIONS);
    },
  );

  it('should activate a loader when one wants to fetch fence connections', async () => {
    (getFenceUser as jest.Mock).mockImplementation(() => Promise.resolve(MOCK_GEN3_CONNECTION));

    const store = mockStore({
      fenceConnections: {
        fenceConnections: {},
        isFetchingAllFenceConnections: false,
      },
    });
    const expectedActions = [
      {
        isLoading: true,
        type: 'toggleIsFetchingAllFenceConnections',
      },
      {
        connection: MOCK_GEN3_CONNECTION,
        fenceName: GEN3,
        type: FenceConnectionsActions.addFenceConnection,
      },
      {
        isLoading: false,
        type: 'toggleIsFetchingAllFenceConnections',
      },
    ];

    const dispatch: DispatchFenceConnections = store.dispatch;

    await dispatch(fetchAllFencesConnectionsIfNeeded(mockApi, [GEN3]));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
