import React from 'react';

import Heading from 'uikit/Heading';

export default ({ heading, children }) => (
  <div>
    <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>{heading}</Heading>
    <div
      css={`
        display: flex;
        margin-bottom: 13px;
      `}
    >
      {children}
    </div>
  </div>
);
