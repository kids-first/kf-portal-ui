import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ROUTES from './common/routes';
import { MOCK_USER_1_NOT_ADMIN } from './store/actionCreators/Test/mockUserData';
import { DispatchUser, userInitialState, UserState } from './store/userTypes';
import ProtectedRoute from './ProtectedRoute';

const middleware = [thunk];

type StateSliceNeeded = {
  user: UserState;
};

const mockStore = createMockStore<StateSliceNeeded, DispatchUser>(middleware);

const initialState = {
  user: {
    ...userInitialState,
  },
};

let mockIsAuthenticated = false;

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({
      initialized: true,
      keycloak: {
        authenticated: mockIsAuthenticated,
      },
    }),
  };
});

describe('Protected Route', () => {
  let wrapper: ReactWrapper;

  const PageUserWantsToVisit = () => <div id={'x'} />;

  const mountWithProviders = (fakeStore: any, path: string) =>
    mount(
      <Provider store={fakeStore}>
        <MemoryRouter initialEntries={[path]}>
          <ProtectedRoute path={path} exact component={PageUserWantsToVisit} />
        </MemoryRouter>
      </Provider>,
    );

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    const store = mockStore({ ...initialState });
    wrapper = mountWithProviders(store, '/anyPath');
    expect(wrapper.exists()).toBe(true);
  });

  it('should render login when a user is not authenticated and goes to a random route', () => {
    const store = mockStore({ ...initialState });
    wrapper = mountWithProviders(store, '/anyPath');
    const RedirectReturned = wrapper.find(Redirect);
    expect(RedirectReturned).toHaveLength(1);
    expect(RedirectReturned.props()).toEqual({ to: ROUTES.login });
  });

  it('should render the join route when user has not joined yet but is authenticated', () => {
    mockIsAuthenticated = true;
    const store = mockStore({
      user: {
        ...initialState.user,
        user: {
          ...MOCK_USER_1_NOT_ADMIN,
          isAdmin: false,
          groups: [],
          roles: [], //no roles === not joined
        },
      },
    });
    wrapper = mountWithProviders(store, '/anyPath');
    const RedirectReturned = wrapper.find(Redirect);
    expect(RedirectReturned).toHaveLength(1);
    expect(RedirectReturned.props()).toEqual({ to: ROUTES.join });
  });

  it(
    'should render terms and conditions route when' +
      ' user is authenticated, has joined but has not accepted terms yet',
    () => {
      mockIsAuthenticated = true;
      const store = mockStore({
        user: {
          ...initialState.user,
          user: {
            ...MOCK_USER_1_NOT_ADMIN,
            acceptedTerms: false,
            isAdmin: false,
            groups: [],
          },
        },
      });
      wrapper = mountWithProviders(store, '/anyPath');
      const RedirectReturned = wrapper.find(Redirect);
      expect(RedirectReturned).toHaveLength(1);
      expect(RedirectReturned.props()).toEqual({ to: ROUTES.termsConditions });
    },
  );

  it(
    'should render the dashboard route when' +
      ' user is authenticated, has joined has accepted terms but hits the login route',
    () => {
      mockIsAuthenticated = true;
      const store = mockStore({
        user: {
          ...initialState.user,
          user: {
            ...MOCK_USER_1_NOT_ADMIN,
            acceptedTerms: true,
            isAdmin: false,
            groups: [],
          },
        },
      });
      wrapper = mountWithProviders(store, ROUTES.login);
      const RedirectReturned = wrapper.find(Redirect);
      expect(RedirectReturned).toHaveLength(1);
      expect(RedirectReturned.props()).toEqual({ to: ROUTES.dashboard });
    },
  );

  it(
    'should render the desired route when' +
      ' user is authenticated, has joined and has accepted terms',
    () => {
      mockIsAuthenticated = true;
      const store = mockStore({
        user: {
          ...initialState.user,
          user: {
            ...MOCK_USER_1_NOT_ADMIN,
            acceptedTerms: true,
            isAdmin: false,
            groups: [],
          },
        },
      });
      wrapper = mountWithProviders(store, '/validRoute');
      const RouteReturned = wrapper.find(Route);
      expect(RouteReturned).toHaveLength(1);
      expect(RouteReturned.props()).toEqual(expect.objectContaining({ path: '/validRoute' }));
      expect(RouteReturned.find(PageUserWantsToVisit)).toHaveLength(1);
    },
  );
});
