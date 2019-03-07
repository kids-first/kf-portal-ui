import React from 'react';
import Component from 'react-component-component';
import { Link } from 'react-router-dom';
import LoadingSpinner from 'uikit/LoadingSpinner';

const LinkWithLoader = ({ getLink, title }) => (
  <Component
    initialState={{ isLoading: true, url: null }}
    didMount={async ({ setState }) => {
      const url = await getLink();
      setState({ isLoading: false, url });
    }}
  >
    {({ state }) =>
      state.isLoading ? <LoadingSpinner center={false} /> : <Link to={state.url}>{title}</Link>
    }
  </Component>
);

export default LinkWithLoader;
