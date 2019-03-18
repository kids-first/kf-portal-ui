import * as React from 'react';

export default ({ width = 94, height = 94, fill = '#a9adc0', ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 54" width={width} height={height}>
      <defs>
        <style>{`.cls-1{fill: ${fill};}`}</style>
      </defs>
      <title>icon-files</title>
      <path
        className="cls-1"
        d="M44.8,12H34V1.2ZM32,16a2,2,0,0,1-2-2V0H2A2,2,0,0,0,0,2V54a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V16Z"
      />
    </svg>
  );
};
