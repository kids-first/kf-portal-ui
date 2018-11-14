import React from 'react';

const Tooltip = ({ id, value, index, color, data, formatter = () => null }) => (
  <div style={{ fill: '#404c9a' }} keys={index}>
    {formatter(data)}
  </div>
);

export default Tooltip;
