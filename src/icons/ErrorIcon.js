import * as React from 'react';

export default ({ width = 94, height = 94, fill = '#d8202f', background = '#fff', ...props }) => {
  return (
    <svg
      id="Isolation_Mode"
      data-name="Isolation Mode"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 94 94"
      height={height}
      width={width}
      {...props}
    >
      <defs />
      <title>icon-error</title>
      <g id="Layer_1" data-name="Layer 1">
        <circle fill={background} cx="47" cy="47" r="43" />
        <path
          fill={fill}
          d="M47,94A47,47,0,1,1,94,47,47,47,0,0,1,47,94ZM47,8A39,39,0,1,0,86,47,39,39,0,0,0,47,8Z"
          transform="translate(0 0)"
        />
        <path
          fill={fill}
          d="M59.83,64.07a4.25,4.25,0,0,1-3-1.26L47,53.05,37.2,62.83a4.32,4.32,0,0,1-6.05,0,4.26,4.26,0,0,1,0-6L41,47l-9.79-9.8a4.3,4.3,0,0,1,0-6.05,4.38,4.38,0,0,1,6.07,0L47.06,41l9.7-9.65a4.3,4.3,0,0,1,6,0,4.24,4.24,0,0,1,0,6.05L53.11,47l9.74,9.74a4.3,4.3,0,0,1,0,6.06,4.25,4.25,0,0,1-3,1.26Zm-1-30.75h0Z"
          transform="translate(0 0)"
        />
      </g>
    </svg>
  );
};
