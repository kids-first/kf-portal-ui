import React from 'react';

export default ({ width = 15, height = 15, fill = '#a9adc0', className = '', ...props }) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56 64.01"
    width={width}
    height={height}
    {...props}
  >
    <defs />
    {props.hideTitle ? null : <title>icon-controlled-access</title>}
    <path
      fill={fill}
      className="cls-1"
      d="M48,28a8,8,0,0,1,8,8V56a8,8,0,0,1-8,8H8a8,8,0,0,1-8-8V36a8,8,0,0,1,8-8h2V18.44A18.3,18.3,0,0,1,27.34,0H28A18,18,0,0,1,46,18V30c0,1.1-.9,3-2,3H38c-1.1,0-2-1.9-2-3V18.29a8.19,8.19,0,0,0-6.82-8.19A8,8,0,0,0,20,18V28Z"
    />
  </svg>
);
