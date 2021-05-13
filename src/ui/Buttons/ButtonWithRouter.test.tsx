import React from 'react';
import { Router } from 'react-router';
import { shallow, ShallowWrapper } from 'enzyme';

import history from 'services/history';

import ButtonWithRouter from './ButtonWithRouter';

describe('ButtonWithRouter', () => {
  let wrapper: ShallowWrapper;

  const shallowWithProvider = (getLink: () => Promise<any> = () => Promise.resolve('/routeXYZ')) =>
    shallow(
      <Router history={history}>
        <ButtonWithRouter getLink={getLink}>{'Label'}</ButtonWithRouter>
      </Router>,
    );

  it('should render', () => {
    wrapper = shallowWithProvider();
    expect(wrapper.exists()).toBe(true);
  });
});
