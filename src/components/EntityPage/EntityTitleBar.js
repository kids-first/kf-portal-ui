import * as React from 'react';

import { Flex } from 'uikit/Core';
import { ContentContainer } from 'theme/tempTheme';

import './EntityPage.css';

export default ({ children }) => (
  <Flex className="entityTitleBar">
    <ContentContainer>{children}</ContentContainer>
  </Flex>
);
