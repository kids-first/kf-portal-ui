import * as React from 'react';

export default ({ height, width, fill = '#fff', background = '#fff', ...props }) => {
  return (
    <svg viewBox="0 0 94 94" width={width} height={height} {...props}>
      <title>icon-with-check</title>
      <path
        fill={background}
        stroke={fill}
        strokeMiterlimit={10}
        strokeWidth={8}
        d="M47,8a38.82,38.82,0,0,0-24.68,8.83L77.17,71.68A39,39,0,0,0,47,8Z"
      />
      <path
        fill={background}
        stroke={fill}
        strokeMiterlimit={10}
        strokeWidth={8}
        d="M8,47A39,39,0,0,0,72.1,76.82L17.18,21.9A38.82,38.82,0,0,0,8,47Z"
      />
      <path
        fill={fill}
        d="M47,0A47,47,0,1,0,94,47,47.05,47.05,0,0,0,47,0Zm0,86A39,39,0,0,1,17.18,21.9L72.1,76.82A38.82,38.82,0,0,1,47,86ZM22.32,16.83A39,39,0,0,1,77.17,71.68Z"
      />
    </svg>
  );
};
