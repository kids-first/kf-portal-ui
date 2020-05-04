import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VariantDb from '../index';
import { jestPatchMatchMedia } from '../../../utils';

configure({ adapter: new Adapter() });

describe('VariantDb', () => {
  const props = {};

  let wrapper: ReactWrapper;

  beforeAll(() => jestPatchMatchMedia());

  beforeEach(() => {
    wrapper = mount(<VariantDb {...props} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render VariantDb Page', () => {
    expect(wrapper.length).toEqual(1);
  });
});
