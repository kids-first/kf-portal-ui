import React from 'react';
import PropTypes from 'prop-types';
import Component from 'react-component-component';
import graphql from 'services/arranger';

const QueriesResolver = ({ children, queries, api }) => (
  <Component
    initialState={{ data: null, isLoading: true, error: null }}
    didMount={({ setState }) => {
      const { query, variables, transform = x => x } = queries[0];
      console.log('query', query, 'variables', variables);
      graphql(api)({
        query,
        variables,
      })
        .then(data => transform(data))
        .then(data => setState({ data: data, isLoading: false }))
        .catch(err => setState({ isLoading: false, error: err }));
    }}
  >
    {({ state }) => children(state)}
  </Component>
);

export default QueriesResolver;

QueriesResolver.propTypes = {
  api: PropTypes.isRequired,
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      query: PropTypes.string.isRequired,
      variables: PropTypes.isRequired,
      transform: PropTypes.func,
    }),
  ).isRequired,
};
