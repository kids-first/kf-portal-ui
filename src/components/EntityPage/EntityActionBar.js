import * as React from 'react';

import { Flex } from 'uikit/Core';
import { ContentContainer } from 'theme/tempTheme';
import { entityPageActionBar } from './EntityPage.module.css';

export default ({ children }) => (
  <Flex className={entityPageActionBar}>
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
