import React from 'react';

const Tooltip = ({ id, value, index, color, data }) => (
  <div
    style={{ fill: '#404c9a' }}
    keys={index}
  >{`${data.maxVal.toLocaleString()} Participants`}</div>
);

export default Tooltip;
