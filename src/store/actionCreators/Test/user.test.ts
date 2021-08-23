import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { trackUserSession } from 'services/analyticsTracking';
import { extractGroupsFromToken } from 'store/tokenUtils';
import { DispatchUser, UserActions, userInitialState, UserState } from 'store/userTypes';

import { logout, receiveUser } from '../user';

import { MOCK_USER_1_NOT_ADMIN, MOCK_USER_2_ADMIN } from './mockUserData';

const middleware = [thunk];

type StateSliceNeeded = {
  user: UserState;
};

const mockStore = createMockStore<StateSliceNeeded, DispatchUser>(middleware);

jest.mock('services/fenceStudies');
jest.mock('store/tokenUtils');
jest.mock('services/analyticsTracking');

const initialState = {
  user: {
    ...userInitialState,
  },
};

describe('User actions', () => {
  beforeEach(() => {
    console.error = jest.fn();
    (extractGroupsFromToken as jest.Mock).mockReset();
    (trackUserSession as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an action to logout', () => {
    const expectedAction = {
      type: UserActions.logout,
    };
    expect(logout()).toEqual(expectedAction);
  });

  it('should receive a raw user and enhance it with computed values', async () => {
    (extractGroupsFromToken as jest.Mock).mockImplementation((fakeToken: string) =>
      fakeToken.includes('kf-investigator') ? ['kf-investigator'] : [],
    );
    const storeNoAdminToken = mockStore({
      ...initialState,
      user: {
        ...initialState.user,
        userToken: 'abcdkf',
      },
    });

    const dispatchNotAdmin: DispatchUser = storeNoAdminToken.dispatch;

    await dispatchNotAdmin(receiveUser(MOCK_USER_1_NOT_ADMIN));

    const expectedActionsNotAdmin = [
      {
        payload: {
          ...MOCK_USER_1_NOT_ADMIN,
          groups: [],
          isAdmin: false,
        },
        type: UserActions.receiveUserWithComputedValues,
      },
    ];
    expect(storeNoAdminToken.getActions()).toEqual(expectedActionsNotAdmin);

    const storeWithAdminToken = mockStore({
      ...initialState,
      user: {
        ...initialState.user,
        userToken: 'abcdkfkf-investigator',
      },
    });

    const dispatchWithAdmin: DispatchUser = storeWithAdminToken.dispatch;

    await dispatchWithAdmin(receiveUser(MOCK_USER_2_ADMIN));

    const expectedActionsWithAdmin = [
      {
        payload: {
          ...MOCK_USER_2_ADMIN,
          groups: ['kf-investigator'],
          isAdmin: true,
        },
        type: UserActions.receiveUserWithComputedValues,
      },
    ];
    expect(storeWithAdminToken.getActions()).toEqual(expectedActionsWithAdmin);
  });
});
