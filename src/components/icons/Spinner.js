import React from 'react';
import Spinner from 'react-spinkit';

export default ({ size = 15 }) => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#fff"
    style={{
      width: size,
      height: size,
      marginRight: 9,
    }}
  />
);
