import React from 'react';
import AddRemoveSaveSetModal from '../AddRemoveSaveSetModal';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { jestPatchMatchMedia } from 'utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { SaveSetState, SetSubActionTypes, UserSet } from 'store/saveSetTypes';

configure({ adapter: new Adapter() });

const middleware = [thunk];
const mockStore = configureStore(middleware);
const userSaveSets = [] as UserSet[];

const initialSaveSetModalState: SaveSetState = {
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    sets: userSaveSets,
    error: null,
    isLoading: false,
    isEditing: true,
    isDeleting: false,
  },
};

jest.mock('services/sets');

describe('Add/Remove Save Set Modal', () => {
  const props = {
    user: {
      _id: 'abc',
      roles: ['researcher'],
      egoId: '123',
      email: 'abc@gmail.com',
      acceptedDatasetSubscriptionKfOptIn: true,
      acceptedKfOptIn: true,
      acceptedNihOptIn: true,
      acceptedTerms: true,
    },
    subActionType: SetSubActionTypes.ADD_IDS,
    sqon: {
      op: 'and',
      content: [],
    },
    hideModalCb: jest.fn(),
  };

  beforeAll(() => jestPatchMatchMedia());

  let wrapper: ReactWrapper;

  const mountWithProvider = (fakeStore: any) =>
    mount(
      <Provider store={fakeStore}>
        <AddRemoveSaveSetModal {...props} />
      </Provider>,
    );

  beforeAll(() => jestPatchMatchMedia());

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    const store = mockStore({
      saveSets: initialSaveSetModalState,
    });
    wrapper = mountWithProvider(store);
    expect(wrapper.exists()).toBe(true);
  });

  it('should be loading on a editing state', () => {
    const store = mockStore({
      saveSets: initialSaveSetModalState,
    });
    wrapper = mountWithProvider(store);

    // @ts-ignore
    expect(wrapper.find('#EditSaveSets').at(0).props()['loading']).toBe(true);
  });
});
