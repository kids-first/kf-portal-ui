import React from 'react';
import Spinner from 'react-spinkit';
import Column from './Column';

const LoadingSpinner = ({ size = '11px', color = 'black', center = true, className = '' }) => (
  <Column center={center} className={className}>
    <Spinner
      fadeIn="none"
      name="circle"
      color={color}
      style={{
        width: size,
        height: size,
      }}
    />
  </Column>
);

export default LoadingSpinner;
