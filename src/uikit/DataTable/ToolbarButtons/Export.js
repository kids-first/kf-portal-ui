import React from 'react';

import saveTSV from '../utils/saveTSV';

const Export = ({ exporter = saveTSV }) => (
  <button
    style={{
      display: 'flex',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      minHeight: 16,
    }}
  >
    Export
  </button>
);
