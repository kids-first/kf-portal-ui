import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Sunburst from 'components/UI/Charts/Sunburst';
import { treeData } from 'components/OntologyBrowser/Test/mockData';

configure({ adapter: new Adapter() });

describe('Sunburst', () => {
  const props = {};

  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(<Sunburst data={treeData} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper.length).toEqual(1);
    expect(wrapper.find('svg').exists()).toBeTruthy();
    expect(wrapper.find('svg').prop('width')).toEqual(300);
  });

  it('should render width default value', () => {
    expect(wrapper.find('svg').prop('width')).toEqual(300);
    expect(wrapper.find('svg').prop('height')).toEqual(300);
    expect(wrapper.find('svg').prop('viewBox')).toEqual('0 0 300 300');
  });

  it('should render width custom value', () => {
    wrapper.setProps({ width: 400, height: 450 });
    expect(wrapper.find('svg').prop('width')).toEqual(400);
    expect(wrapper.find('svg').prop('height')).toEqual(450);
    expect(wrapper.find('svg').prop('viewBox')).toEqual('0 0 400 450');
  });
});
