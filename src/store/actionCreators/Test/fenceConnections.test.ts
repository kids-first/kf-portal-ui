import { AnyAction } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DCF, FENCES, GEN3, INTEGRATION_PREFIX } from 'common/constants';
import { getFenceUser } from 'services/fence';
import { DispatchFenceConnections, FenceConnectionsActions } from 'store/fenceConnectionsTypes';
import { makeFakeLocalStorage } from 'utils';

import {
  addFenceConnection,
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

const NO_ACTIONS: AnyAction[] = [];

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('services/fence');

describe('Fence Connections actions', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: makeFakeLocalStorage(),
    });
  });

  beforeEach(() => {
    (getFenceUser as jest.Mock).mockReset();
  });

  afterEach(() => {
    window.localStorage.clear();
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

  it('should create an action to add a fence connection', () => {
    const expectedAction = {
      type: FenceConnectionsActions.addFenceConnection,
      fenceName: GEN3,
      connection: MOCK_GEN3_CONNECTION,
    };
    expect(addFenceConnection(GEN3, MOCK_GEN3_CONNECTION)).toEqual(expectedAction);
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

  it('should not fetch fence connections if user has no integration token for particular fence', async () => {
    localStorage.removeItem(`${INTEGRATION_PREFIX}${GEN3}`);

    const store = mockStore({
      fenceConnections: {
        fenceConnections: {},
        isFetchingAllFenceConnections: false,
      },
    });

    const dispatch: DispatchFenceConnections = store.dispatch;

    await dispatch(fetchFencesConnectionsIfNeeded(mockApi, GEN3));

    expect(store.getActions()).toEqual(NO_ACTIONS);
  });

  it(
    'should not fetch fence connections if user has' +
      ' 1) an integration token' +
      ' 2) already has connection for particular fence',
    async () => {
      (getFenceUser as jest.Mock).mockImplementation(() => Promise.resolve(MOCK_GEN3_CONNECTION));
      localStorage.setItem(`${INTEGRATION_PREFIX}${GEN3}`, 'token');

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
        type: FenceConnectionsActions.toggleIsFetchingAllFenceConnections,
        isLoading: true,
      },
      {
        type: FenceConnectionsActions.toggleIsFetchingAllFenceConnections,
        isLoading: false,
      },
    ];

    const dispatch: DispatchFenceConnections = store.dispatch;

    await dispatch(fetchAllFencesConnectionsIfNeeded(mockApi, FENCES));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
