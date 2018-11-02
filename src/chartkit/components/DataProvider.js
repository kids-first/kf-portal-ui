import React from 'react';
import Component from 'react-component-component';
import PropTypes from 'prop-types';

/**
 * Expects an api object to make a request
 * optional data transform
 */
const DataProvider = ({ api, url = '', transform = x => x, children }) => (
  <Component
    initialState={{ data: null, isLoading: true }}
    didMount={({ setState }) => {
      api({ method: 'get', url: url })
        .then(data => transform(data))
        .then(data => setState({ data: data, isLoading: false }))
        .catch(err => console.log('err', err));
    }}
  >
    {({ state }) => children(state)}
  </Component>
);

DataProvider.propTypes = {
  api: PropTypes.func.isRequired,
  endpoint: PropTypes.string,
  transform: PropTypes.func,
  children: PropTypes.func.isRequired,
};

export default DataProvider;
