import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConfirmDelVirtualStudy from '../ConfirmDelVirtualStudy';

configure({ adapter: new Adapter() });

const middleware = [thunk];
const mockStore = configureStore(middleware);

const initialState = {
  currentVirtualStudy: {
    isLoading: false,
    error: null,
  },
  user: {
    egoId: '',
    _id: '',
  },
};

describe('Virtual Study Deletion Modal', () => {
  let wrapper: ReactWrapper;

  const mountWithProvider = (fakeStore: any) =>
    mount(
      <Provider store={fakeStore}>
        <ConfirmDelVirtualStudy
          virtualStudy={{
            activeIndex: 0,
            creationDate: '',
            description: '',
            dirty: false,
            name: '',
            sharedPublicly: false,
            sqons: () => {},
            uid: 'abcXYZ',
            virtualStudyId: 'v01',
          }}
          onCloseCb={() => {}}
        />
      </Provider>,
    );

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    const store = mockStore({
      ...initialState,
    });
    wrapper = mountWithProvider(store);
    expect(wrapper.exists()).toBe(true);
  });
});
