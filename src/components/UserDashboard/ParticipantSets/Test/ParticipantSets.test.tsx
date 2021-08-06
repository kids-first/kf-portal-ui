import React from 'react';
import { Provider } from 'react-redux';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getSetAndParticipantsCountByUser } from 'services/sets';
import { SaveSetState, UserSet } from 'store/saveSetTypes';
import { jestPatchMatchMedia } from 'utils';

import ParticipantSets from '../index';

jest.mock('services/sets');

configure({ adapter: new Adapter() });

const middleware = [thunk];
const mockStore = configureStore(middleware);

const userSaveSets = [] as UserSet[];

const initialState: SaveSetState = {
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    sets: userSaveSets,
    error: null,
    isLoading: true,
    isDeleting: false,
  },
};

const user = {
  _id: 'id',
  roles: [],
  egoId: 'userEgoId',
  email: 'email',
  acceptedDatasetSubscriptionKfOptIn: true,
  acceptedKfOptIn: true,
  acceptedNihOptIn: true,
  acceptedTerms: true,
};

describe('ParticipantSets', () => {
  const props = {
    user: user,
  };

  let wrapper: ReactWrapper;

  const mountWithProvider = (fakeStore: any) =>
    mount(
      <Provider store={fakeStore}>
        <ParticipantSets {...props} />
      </Provider>,
    );

  beforeAll(() => jestPatchMatchMedia());

  beforeEach(() => {
    (getSetAndParticipantsCountByUser as jest.Mock).mockReset();
  });

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    (getSetAndParticipantsCountByUser as jest.Mock).mockImplementation(() => Promise.resolve([]));
    const store = mockStore({
      saveSets: initialState,
    });
    wrapper = mountWithProvider(store);
    expect(wrapper.exists()).toBe(true);
  });

  it('should display a Spinner when it is in a loading state', () => {
    (getSetAndParticipantsCountByUser as jest.Mock).mockImplementation(() => Promise.resolve([]));
    const store = mockStore({
      saveSets: {
        ...initialState,
        userSets: { isLoading: true, sets: userSaveSets, error: null },
      },
    });
    wrapper = mountWithProvider(store);
    expect(wrapper.find('Spin').length).toBe(1);
  });
});
