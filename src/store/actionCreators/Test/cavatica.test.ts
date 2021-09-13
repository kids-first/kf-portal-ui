import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getUser } from 'services/cavatica';
import { CavaticaActions, CavaticaState, DispatchCavatica } from 'store/cavaticaTypes';
import { ConnectionStatus } from 'store/connectionTypes';

import { checkIfUserIsConnected, toggleIsConnecting } from '../cavatica';

const middleware = [thunk];

type StateSliceNeeded = {
  cavatica: CavaticaState;
};

const mockStore = createMockStore<StateSliceNeeded, DispatchCavatica>(middleware);

jest.mock('services/cavatica');
jest.mock('antd', () => ({ notification: { success: jest.fn(), error: jest.fn() } }));

const initialStore = {
  cavatica: {
    isConnecting: false,
    isConnected: false,
    status: ConnectionStatus.unknown,
  },
};

describe('Cavatica actions', () => {
  beforeEach(() => {
    console.error = jest.fn();
    (getUser as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an action to toggle when connecting', () => {
    const expectedAction = {
      type: CavaticaActions.toggleIsConnecting,
      isChecking: true,
    };
    expect(toggleIsConnecting(true)).toEqual(expectedAction);
  });

  it('should create an action to check if user is connected', async () => {
    (getUser as jest.Mock).mockImplementation(() => Promise.resolve());

    const store = mockStore(initialStore);

    const dispatch: DispatchCavatica = store.dispatch;

    await dispatch(checkIfUserIsConnected());

    const expectedActions = [
      {
        type: CavaticaActions.toggleIsConnecting,
        isChecking: true,
      },
      {
        type: CavaticaActions.addConnectionStatus,
        newStatus: ConnectionStatus.connected,
      },
      {
        type: CavaticaActions.toggleIsConnecting,
        isChecking: false,
      },
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });
});
