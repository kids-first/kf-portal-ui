import React from 'react';

export default ({ width = 94, height = 94, fill = '#22afe9', ...props }) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 94 94"
    width={width}
    height={height}
  >
    <defs />
    <title>icon-note</title>
    <path
      fill={fill}
      d="M68.27,80.25H9.75V21.73H40.68L50.44,12H9.75A9.75,9.75,0,0,0,0,21.73V80.25A9.76,9.76,0,0,0,9.75,90H68.27A9.75,9.75,0,0,0,78,80.25V39.56l-9.75,9.76Z"
    />
    <rect
      fill={fill}
      x="28.55"
      y="24.88"
      width="53.64"
      height="19.51"
      transform="translate(-8.27 49.29) rotate(-45)"
    />
    <path
      fill={fill}
      d="M88.89,9.54,80.46,1.11a3.79,3.79,0,0,0-5.36,0L70.88,5.33l13.8,13.79,4.21-4.22A3.79,3.79,0,0,0,88.89,9.54Z"
    />
    <polygon fill={fill} points="26.06 50.15 22.61 67.39 39.85 63.94 26.06 50.15" />
  </svg>
);
