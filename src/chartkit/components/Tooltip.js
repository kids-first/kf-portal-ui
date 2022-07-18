import React from 'react';

const Tooltip = ({ className = '', index, data, children = null, formatter = (v) => v }) => (
  <div
    className={`tooltip ${className}`}
    keys={index}
    style={{
      fill: '#404c9a',
      fontFamily: 'Open Sans, sans-serif',
      fontSize: '12px',
    }}
  >
    {children ? children : formatter(data)}
  </div>
);

export default Tooltip;
