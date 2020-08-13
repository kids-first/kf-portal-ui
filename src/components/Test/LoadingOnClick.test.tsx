import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LoadingOnClick from '../LoadingOnClick';

configure({ adapter: new Adapter() });

describe('LoadingOnClick', () => {
  let wrapper: ReactWrapper;

  const mountWithProvider = (render: Function, onClick: Function, ...extra: any) =>
    mount(<LoadingOnClick render={render} onClick={onClick} {...extra} />);

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    wrapper = mountWithProvider(() => <div />, jest.fn);
    expect(wrapper.exists()).toBe(true);
  });
});
