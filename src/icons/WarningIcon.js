import React from 'react';

export default ({ width = 94, height = 94, fill = '#ff9427', bg = '#fff', ...props }) => (
  <svg
    id="Isolation_Mode"
    data-name="Isolation Mode"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 94 94"
    width={width}
    height={height}
  >
    <defs />
    <title>icon-warning</title>
    <g id="Layer_1" data-name="Layer 1">
      <circle fill={bg} class="cls-1" cx="47" cy="47" r="43" />
      <path
        fill={fill}
        class="cls-2"
        d="M47,94A47,47,0,1,1,94,47,47,47,0,0,1,47,94ZM47,8A39,39,0,1,0,86,47,39.05,39.05,0,0,0,47,8Z"
      />
      <path
        fill={fill}
        class="cls-2"
        d="M54.62,65.27A7.62,7.62,0,1,1,47,57.65,7.63,7.63,0,0,1,54.62,65.27ZM40.26,23.5l1.29,25.93a2.29,2.29,0,0,0,2.29,2.17h6.32a2.29,2.29,0,0,0,2.29-2.17L53.74,23.5a2.28,2.28,0,0,0-2.28-2.4H42.54A2.28,2.28,0,0,0,40.26,23.5Z"
      />
    </g>
  </svg>
);
