import * as React from 'react';

export default ({ height, width, fill = '#fff', background = '#fff', ...props }) => {
  return (
    <svg viewBox="0 0 94 94" width={width} height={height} {...props}>
      <title>icon-with-check</title>
      <circle
        fill={background}
        stroke={fill}
        strokeMiterlimit={10}
        strokeWidth={8}
        cx="47"
        cy="47"
        r="43"
      />
      <path
        fill={fill}
        d="M39.57,65.67,24.51,50.61a2.32,2.32,0,0,1,0-3.28l3.28-3.28a2.32,2.32,0,0,1,3.28,0L41.21,54.2,62.94,32.47a2.32,2.32,0,0,1,3.28,0l3.28,3.28a2.32,2.32,0,0,1,0,3.28L42.85,65.67a2.32,2.32,0,0,1-3.28,0Z"
      />
    </svg>
  );
};
