import * as React from 'react';

import { Flex } from 'uikit/Core';
import { ContentContainer } from 'theme/tempTheme';
import './EntityPage.css';

export default ({ children }) => (
  <Flex className="entityPageActionBar">
    <ContentContainer
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
      }}
    >
      {children}
    </ContentContainer>
  </Flex>
);
