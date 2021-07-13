import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

const ErrorText = () => <div>Error no data</div>;

const ChartLoadGate = ({ fetchedState: { isLoading, data }, Chart, Error = ErrorText }) =>
  isLoading ? <Spin size={'large'} /> : data ? <Chart data={data} /> : <Error />;

ChartLoadGate.propTypes = {
  fetchedState: PropTypes.object,
  Chart: PropTypes.elementType.isRequired,
  Loader: PropTypes.elementType,
  ErrorMessage: PropTypes.element,
  Error: PropTypes.elementType,
};

export default ChartLoadGate;
