import React from 'react';
import Component from 'react-component-component';

/**
 * Expects an axios object to make a request
 * an api endpoint
 * optional data transform
 */
const ChartWrapper = ({ api = '', endpoint = '', transform = x => x, children }) => (
  <Component
    style={{ height: '100%' }}
    initialState={{ data: null, isLoading: true }}
    didMount={({ setState }) => {
      api(`${endpoint}`)
        .then(resp => resp.data)
        .then(data => transform(data))
        .then(data => setTimeout(() => setState({ data: data, isLoading: false }), 2000))
        .catch(err => console.log('err', err));
    }}
  >
    {({ state }) => children(state)}
  </Component>
);

export default ChartWrapper;
