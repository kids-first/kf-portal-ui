import React from 'react';
import PropTypes from 'prop-types';
import Component from 'react-component-component';
import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';

const QueriesResolver = ({ children, queries, api }) => (
  <Component
    initialState={{ data: null, isLoading: true, error: null }}
    didMount={({ setState }) => {
      const body = JSON.stringify(
        queries.map(q => ({
          query: q.query,
          variables: q.variables,
        })),
      );

      api({
        method: 'POST',
        url: urlJoin(arrangerApiRoot, `/${arrangerProjectId}/graphql`),
        body,
      })
        .then(data =>
          data.map((d, i) => {
            const transform = queries[i].transform;
            return transform ? transform(d) : d;
          }),
        )
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
