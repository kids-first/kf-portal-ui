import React from 'react';
import Spinner from 'react-spinkit';

export const LoadingSpinner = ({ width = 11, height = 11 }) => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="black"
    style={{
      width,
      height,
    }}
  />
);
