import React from 'react';
import Component from 'react-component-component';

import LoadingSpinner from 'uikit/LoadingSpinner';

/**
 * Expects an axios object to make a request
 * an api endpoint
 * optional data transform
 * optional loading element
 * optional error element
 */
const ChartWrapper = ({
  api = '',
  endpoint = '',
  transform = x => x,
  children,
  Loader = LoadingSpinner,
}) => (
  <Component
    style={{ height: '100%' }}
    initialState={{ data: null, isLoading: true }}
    didMount={({ setState }) => {
      api(`${endpoint}`)
        .then(resp => resp.data)
        .then(data => transform(data))
        .then(data => setState({ data: data, isLoading: false }))
        .catch(err => console.log('err', err));
    }}
  >
    {({ state }) =>
      state.isLoading ? (
        <Loader size="50px" />
      ) : state.data ? (
        React.cloneElement(children, { data: state.data })
      ) : (
        <div>no data :(</div>
      )
    }
  </Component>
);

export default ChartWrapper;
