import * as React from 'react';

import { ContentContainerColumn } from 'theme/tempTheme';

export default ({ children }) => (
  <ContentContainerColumn
    style={{
      padding: '10px 0',
    }}
  >
    {children}
  </ContentContainerColumn>
);
