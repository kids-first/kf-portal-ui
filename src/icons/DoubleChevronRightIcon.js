import * as React from 'react';

export default ({ height, width, fill = '#fff', ...props }) => {
  return (
    <svg viewBox="0 0 99.2 90.93" width={width} height={height} {...props}>
      <title>icon-double-chevron-right</title>
      <path
        fill={fill}
        d="M61.16,87.88l35-35a10.55,10.55,0,0,0,0-14.83l-35-35A10.42,10.42,0,0,0,46.43,17.79L74.11,45.46,46.43,73.14A10.42,10.42,0,0,0,61.16,87.88"
      />
      <path
        fill={fill}
        d="M17.79,87.88l35-35a10.55,10.55,0,0,0,0-14.83l-35-35A10.42,10.42,0,1,0,3.05,17.79L30.73,45.46,3.05,73.14A10.42,10.42,0,0,0,17.79,87.88"
      />
    </svg>
  );
};
