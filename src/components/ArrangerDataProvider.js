import React from 'react';
import Component from 'react-component-component';
import PropTypes from 'prop-types';

import { arrangerApiProjectId, kfArrangerApiRoot } from 'common/injectGlobals';

/**
 * Expects an api object to make a request
 * optional data transform
 */
const ArrangerDataProvider = ({ api, query = '', sqon = {}, transform = (x) => x, children }) => (
  <Component
    initialState={{ data: null, isLoading: true, error: null }}
    didMount={({ setState }) => {
      api({
        method: 'POST',
        url: `${kfArrangerApiRoot}search`,
        body: {
          query,
          variables: {
            sqon,
          },
          projectId: arrangerApiProjectId,
        },
      })
        .then((data) => transform(data))
        .then((data) => setState({ data: data, isLoading: false }))
        .catch((err) => setState({ isLoading: false, error: err }));
    }}
  >
    {({ state }) => children(state)}
  </Component>
);

ArrangerDataProvider.propTypes = {
  api: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  sqon: PropTypes.object,
  transform: PropTypes.func,
  children: PropTypes.func.isRequired,
};

export default ArrangerDataProvider;
