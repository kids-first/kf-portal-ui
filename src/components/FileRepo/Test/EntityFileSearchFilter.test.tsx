import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import EntityFilesSearchInput from '../AggregationSidebar/EntityFileSearchFilter';
import { EntityName, FileSearchFilterSubState } from 'store/fileSearchFiltersTypes';
import { Input } from 'antd';

const { Search } = Input;

configure({ adapter: new Adapter() });

const middleware = [thunk];
const mockStore = configureStore(middleware);

const initialSearchFilterState: FileSearchFilterSubState = {
  isLoading: false,
  error: null,
};

describe('File Search Filter Button', () => {
  let wrapper: ReactWrapper;

  const mountWithProvider = (fakeStore: any) =>
    mount(
      <Provider store={fakeStore}>
        <EntityFilesSearchInput
          entityName={EntityName.PARTICIPANT}
          setSqon={() => {}}
          placeholder={'placeholder'}
        />
      </Provider>,
    );

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    const store = mockStore({
      fileSearchFilters: {
        [EntityName.PARTICIPANT]: {
          ...initialSearchFilterState,
        },
      },
    });
    wrapper = mountWithProvider(store);
    expect(wrapper.exists()).toBe(true);
  });

  it('should display a disabled "antd" Search input when there is an error', () => {
    const store = mockStore({
      fileSearchFilters: {
        [EntityName.PARTICIPANT]: {
          ...initialSearchFilterState,
          error: new Error(''),
        },
      },
    });
    wrapper = mountWithProvider(store);
    const SearchInput = wrapper.find(Search);
    expect(SearchInput.props().disabled).toBe(true);
  });
});
