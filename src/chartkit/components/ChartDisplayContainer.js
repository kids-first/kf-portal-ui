import React from 'react';

// this component scopes the charts' dom within a relative-absolute pair to avoid weird dom movement with tooltips
export default ({ children }) => (
  <div style={{ position: 'relative', height: '100%', width: '100%' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}> {children}</div>
  </div>
);
