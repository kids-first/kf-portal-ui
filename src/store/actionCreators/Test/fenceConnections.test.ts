import { AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { fetchFenceConnection } from 'services/fence';
import { ConnectionStatus } from 'store/connectionTypes';
import {
  DispatchFenceConnections,
  FenceConnectionsActions,
  fenceConnectionsInitialState,
  FenceConnectionsState,
} from 'store/fenceConnectionsTypes';
import { FenceName } from 'store/fenceTypes';

import {
  addFenceConnectError,
  addFenceConnection,
  addFenceDisconnectError,
  addFenceStatus,
  computeAclsByFence,
  computeAclsForConnection,
  concatAllFencesAcls,
  connectFence,
  fetchFencesConnections,
  fetchFencesConnectionsIfNeeded,
  removeFenceConnectError,
  removeFenceConnection,
  removeFenceDisconnectError,
  toggleIsFetchingAllFenceConnections,
  toggleIsFetchingOneFenceConnection,
} from '../fenceConnections';

import { MOCK_FENCE_CONNECTIONS, MOCK_GEN3_CONNECTION, mockApi } from './mockDataFence';

const NO_ACTIONS: AnyAction[] = [];

const middleware = [thunk];

type StateSliceNeeded = {
  fenceConnections: FenceConnectionsState;
};

const mockStore = createMockStore<StateSliceNeeded, DispatchFenceConnections>(middleware);

jest.mock('services/fence');
jest.mock('antd', () => ({ notification: { success: jest.fn() } }));

const initialStore = {
  fenceConnections: fenceConnectionsInitialState,
};

describe('Fence Connections actions', () => {
  beforeEach(() => {
    (fetchFenceConnection as jest.Mock).mockReset();
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

  it('should create an action to toggle one fence connection', () => {
    const expectedAction = {
      type: FenceConnectionsActions.toggleIsFetchingOneFenceConnection,
      isLoading: true,
      fenceName: FenceName.gen3,
    };
    expect(toggleIsFetchingOneFenceConnection(true, FenceName.gen3)).toEqual(expectedAction);
  });

  it('should create an action when removing a fence connection', () => {
    const expectedAction = {
      type: FenceConnectionsActions.removeFenceConnection,
      fenceName: FenceName.dcf,
    };
    expect(removeFenceConnection(FenceName.dcf)).toEqual(expectedAction);
  });

  it('should create an action when adding a fence connection', () => {
    const expectedAction = {
      type: FenceConnectionsActions.addFenceConnection,
      fenceName: FenceName.gen3,
      connection: MOCK_GEN3_CONNECTION,
    };
    expect(addFenceConnection(FenceName.gen3, MOCK_GEN3_CONNECTION)).toEqual(expectedAction);
  });

  it('should create an action when adding a fence status', () => {
    const expectedAction = {
      type: FenceConnectionsActions.addConnectionStatus,
      fenceName: FenceName.gen3,
      newStatus: ConnectionStatus.connected,
    };
    expect(addFenceStatus(FenceName.gen3, ConnectionStatus.connected)).toEqual(expectedAction);
  });

  it('should create the adequate action for error management', () => {
    const expectedActionConnectError = {
      type: FenceConnectionsActions.addFenceConnectError,
      fenceName: FenceName.gen3,
    };
    expect(addFenceConnectError(FenceName.gen3)).toEqual(expectedActionConnectError);

    const expectedActionRemoveConnectError = {
      type: FenceConnectionsActions.removeFenceConnectError,
      fenceName: FenceName.gen3,
    };
    expect(removeFenceConnectError(FenceName.gen3)).toEqual(expectedActionRemoveConnectError);

    const expectedActionDisconnectError = {
      type: FenceConnectionsActions.addFenceDisconnectError,
      fenceName: FenceName.gen3,
    };
    expect(addFenceDisconnectError(FenceName.gen3)).toEqual(expectedActionDisconnectError);

    const expectedActionRemoveDisconnectError = {
      type: FenceConnectionsActions.removeFenceDisconnectError,
      fenceName: FenceName.gen3,
    };
    expect(removeFenceDisconnectError(FenceName.gen3)).toEqual(expectedActionRemoveDisconnectError);
  });

  it('should manage acls adequately', () => {
    expect(concatAllFencesAcls(MOCK_FENCE_CONNECTIONS)).toEqual(['a', 'b', 'c', 'x', 'y', 'z']);
    expect(computeAclsForConnection(MOCK_FENCE_CONNECTIONS[FenceName.gen3])).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(computeAclsByFence(MOCK_FENCE_CONNECTIONS)).toEqual({
      [FenceName.gen3]: ['a', 'b', 'c'],
      [FenceName.dcf]: ['x', 'y', 'z'],
    });
  });

  it('should fetch fence connections when user is adequately connected to a data repository', async () => {
    (fetchFenceConnection as jest.Mock).mockImplementation(() =>
      Promise.resolve(MOCK_GEN3_CONNECTION),
    );
    const store = mockStore(initialStore);

    const dispatch: DispatchFenceConnections = store.dispatch;

    await dispatch(fetchFencesConnections(mockApi, FenceName.gen3));

    const expectedActions = [
      {
        type: FenceConnectionsActions.addFenceConnection,
        fenceName: FenceName.gen3,
        connection: MOCK_GEN3_CONNECTION,
      },
      {
        type: FenceConnectionsActions.addConnectionStatus,
        fenceName: FenceName.gen3,
        newStatus: ConnectionStatus.connected,
      },
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });

  it(
    'should not fetch fence connections if user has' + ' already a connection for particular fence',
    async () => {
      const store = mockStore({
        fenceConnections: {
          ...initialStore.fenceConnections,
          fenceConnections: { [FenceName.gen3]: MOCK_GEN3_CONNECTION },
          statuses: {
            [FenceName.gen3]: ConnectionStatus.connected,
            [FenceName.dcf]: ConnectionStatus.unknown,
          },
        },
      });

      const dispatch: DispatchFenceConnections = store.dispatch;

      await dispatch(fetchFencesConnectionsIfNeeded(mockApi, FenceName.gen3));

      expect(store.getActions()).toEqual(NO_ACTIONS);
    },
  );

  it('should have correct actions when connecting to a fence with no hurdles', async () => {
    (fetchFenceConnection as jest.Mock).mockImplementation(() =>
      Promise.resolve(MOCK_GEN3_CONNECTION),
    );

    const store = mockStore(initialStore);
    const expectedActions = [
      {
        type: FenceConnectionsActions.toggleIsFetchingOneFenceConnection,
        isLoading: true,
        fenceName: FenceName.gen3,
      },
      {
        type: FenceConnectionsActions.addFenceConnection,
        fenceName: FenceName.gen3,
        connection: MOCK_GEN3_CONNECTION,
      },
      {
        type: FenceConnectionsActions.addConnectionStatus,
        fenceName: FenceName.gen3,
        newStatus: ConnectionStatus.connected,
      },
      {
        type: FenceConnectionsActions.toggleIsFetchingOneFenceConnection,
        isLoading: false,
        fenceName: FenceName.gen3,
      },
    ];

    const dispatch: DispatchFenceConnections = store.dispatch;

    await dispatch(connectFence(mockApi, FenceName.gen3));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should have correct actions when connection to a fence has hurdles', async () => {
    (fetchFenceConnection as jest.Mock).mockImplementation(() => Promise.reject('bam!'));

    const store = mockStore(initialStore);
    const expectedActions = [
      {
        type: FenceConnectionsActions.toggleIsFetchingOneFenceConnection,
        isLoading: true,
        fenceName: FenceName.gen3,
      },
      {
        type: FenceConnectionsActions.addFenceConnectError,
        fenceName: FenceName.gen3,
      },
      {
        type: FenceConnectionsActions.removeFenceConnection,
        fenceName: FenceName.gen3,
      },
      {
        type: FenceConnectionsActions.addConnectionStatus,
        fenceName: FenceName.gen3,
        newStatus: ConnectionStatus.disconnected,
      },
      {
        type: FenceConnectionsActions.toggleIsFetchingOneFenceConnection,
        isLoading: false,
        fenceName: FenceName.gen3,
      },
    ];

    const dispatch: DispatchFenceConnections = store.dispatch;

    await dispatch(connectFence(mockApi, FenceName.gen3));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
