import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Router } from 'react-router';
import history from '../../services/history';
import ButtonWithRouter from './ButtonWithRouter';

configure({ adapter: new Adapter() });

describe('ButtonWithRouter', () => {
  let wrapper: ReactWrapper;

  const mountWithProvider = (getLink: () => Promise<any> = () => Promise.resolve('/routeXYZ')) =>
    mount(
      <Router history={history}>
        <ButtonWithRouter getLink={getLink}>{'Label'}</ButtonWithRouter>
      </Router>,
    );

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    wrapper = mountWithProvider();
    expect(wrapper.exists()).toBe(true);
  });
});
