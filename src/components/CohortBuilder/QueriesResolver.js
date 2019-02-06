import React from 'react';
import PropTypes from 'prop-types';

const QueriesResolver = { queries, api };

export default QueriesResolver;

QueriesResolver.propTypes = {
  queries: PropTypes.array.isRequired,
  api: PropTypes.isRequired,
};
