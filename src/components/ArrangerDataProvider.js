import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import graphql from 'services/arranger';

/**
 * Expects an api object to make a request
 * optional data transform
 */
const ArrangerDataProvider = ({ api, query = '', sqon = {}, transform = (x) => x, children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    graphql(api)({
      query,
      variables: {
        sqon,
      },
    })
      .then((data) => transform(data))
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setErrors(err);
      });
  }, []);

  return <>{children({ data, isLoading, errors })}</>;
};

ArrangerDataProvider.propTypes = {
  api: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  sqon: PropTypes.object,
  transform: PropTypes.func,
  children: PropTypes.func.isRequired,
};

export default ArrangerDataProvider;
