import React from 'react';

const svg = ({ width = '12px', height = '12px', ...props }) => (
  <svg
    id="size_copy"
    data-name="size copy"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32.47 22.45"
    width={width}
    height={height}
    css={`
      margin-right: 10px;
      fill: #a9adc0;
    `}
    {...props}
  >
    <title>icon-allapps-contact</title>
    <path d="M16.68,11.88h-.83L.41,1.63A3.05,3.05,0,0,0,0,3.16V19.29a3.18,3.18,0,0,0,3.16,3.16H29.31a3.18,3.18,0,0,0,3.16-3.16V3.16A3.14,3.14,0,0,0,32,1.45L16.69,11.87Z" />
    <path d="M30.74.35A3.08,3.08,0,0,0,29.31,0H3.16A3.07,3.07,0,0,0,1.52.47l14.71,9.79Z" />
  </svg>
);

export default svg;
