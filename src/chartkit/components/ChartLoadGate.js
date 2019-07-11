import React from 'react';
import PropTypes from 'prop-types';

import LoadingSpinner from 'uikit/LoadingSpinner';

const ErrorText = () => <div>Error no data</div>;

const ChartLoadGate = ({
  fetchedState: { isLoading, data, error },
  Chart,
  Loader = LoadingSpinner,
  Error = ErrorText,
}) => (isLoading ? <Loader /> : data ? <Chart data={data} /> : <Error />);

ChartLoadGate.propTypes = {
  fetchedState: PropTypes.object,
  Chart: PropTypes.elementType.isRequired,
  Loader: PropTypes.elementType,
  ErrorMessage: PropTypes.element,
};

export default ChartLoadGate;
