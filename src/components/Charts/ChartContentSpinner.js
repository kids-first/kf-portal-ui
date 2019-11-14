import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

import { chartSpinnerContainer } from './Charts.module.css';

const CardContentSpinner = ({ size = 50, width = size, height = size }) => (
  <div className={chartSpinnerContainer}>
    <Spinner name="circle" style={{ width, height }} />
  </div>
);
CardContentSpinner.propTypes = {
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default CardContentSpinner;
