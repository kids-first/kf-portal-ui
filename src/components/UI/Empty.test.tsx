import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Empty from './Empty';

configure({ adapter: new Adapter() });

describe('Empty', () => {
  let wrapper: ReactWrapper = mount(<Empty />);

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
