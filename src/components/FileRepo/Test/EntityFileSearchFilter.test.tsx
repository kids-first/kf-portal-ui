import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { EntityName } from 'store/fileSearchFiltersTypes';

import { jestPatchMatchMedia } from '../../../utils';
import { EntityFileSearchFilter } from '../AggregationSidebar/EntityFileSearchFilter';

configure({ adapter: new Adapter() });

describe('File Search Filter Button', () => {
  let wrapper: ReactWrapper;
  type callbackMapType = {
    [key: string]: any;
  };

  const map: callbackMapType = {};

  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });

  const mountWithProvider = (error: any = null) =>
    mount(
      <EntityFileSearchFilter
        reInitializeState={(entityName: EntityName) => ({
          type: 'TOGGLE_LOADING_FILES_SEARCH',
          isLoading: false,
          entityName,
        })}
        onSearchById={() => {}}
        isLoading={false}
        error={error}
        entityName={EntityName.PARTICIPANT}
        setSqon={() => {}}
        placeholder={'placeholder'}
      />,
    );

  beforeAll(() => jestPatchMatchMedia());

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    wrapper = mountWithProvider();
    expect(wrapper.exists()).toBe(true);
  });
});
