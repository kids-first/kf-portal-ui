import React from 'react';
import Spinner from 'react-spinkit';
import { Flex } from './Core';
import Column from './Column';

const LoadingSpinner = ({ size = '11px' }) => (
  <Column center={true}>
    <Spinner
      fadeIn="none"
      name="circle"
      color="black"
      style={{
        width: size,
        height: size,
      }}
    />
  </Column>
);

export default LoadingSpinner;
