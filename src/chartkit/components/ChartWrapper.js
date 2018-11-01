import React from 'react';
import Component from 'react-component-component';
import PropTypes from 'prop-types';

/**
 * Expects an axios object to make a request
 * an api endpoint
 * optional data transform
 * optional loader
 * optional err message
 */
const ChartWrapper = ({ api = '', endpoint = '', transform = x => x, children }) => (
  <Component
    initialState={{ data: null, isLoading: true }}
    didMount={({ setState }) => {
      api(`${endpoint}`)
        .then(resp => resp.data)
        .then(data => transform(data))
        .then(data => setState({ data: data, isLoading: false }))
        .catch(err => console.log('err', err));
    }}
  >
    {({ state }) => children(state)}
  </Component>
);

ChartWrapper.protoTypes = {
  api: PropTypes.object.isRequired,
  endpoint: PropTypes.string,
  transform: PropTypes.func,
  children: PropTypes.element.isRequired,
};

export default ChartWrapper;
