import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { initializeApi } from 'services/api';
import graphql from 'services/arranger';

const ArrangerConnectionGuard = ({ graphqlField, render }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [hasConnectionError, setHasConnectionError] = useState(false);

  useEffect(() => {
    graphql(initializeApi())({ query: `query { ${graphqlField} { mapping } }` }).then((x) => {
      setIsConnecting(false);
      setHasConnectionError(!x);
    });

    return () => {
      setIsConnecting(false);
      setHasConnectionError(false);
    };
  });

  return <>{render({ connecting: isConnecting, connectionError: hasConnectionError })}</>;
};

ArrangerConnectionGuard.propTypes = {
  graphqlField: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default ArrangerConnectionGuard;
