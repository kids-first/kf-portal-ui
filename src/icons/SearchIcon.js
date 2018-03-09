import * as React from 'react';

export default ({ height, width, fill = '#fff', ...props }) => {
  return (
    <svg viewBox="0 0 32 32" width={width} height={height} {...props}>
      <title>icon-search</title>
      <path
        fill={fill}
        d="M31.41,28.59l-7.92-7.93a13,13,0,1,0-2.83,2.83l7.92,7.93a2,2,0,0,0,2.83-2.83ZM4,13a9,9,0,1,1,9,9A9,9,0,0,1,4,13Z"
      />
    </svg>
  );
};
