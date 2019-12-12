import * as React from 'react';

import { Flex } from 'uikit/Core';
import { ContentContainer } from 'theme/tempTheme';
import './EntityPage.css';

export default ({ children }) => (
  <Flex className="actionBar">
    <ContentContainer className="actionBar-container">{children}</ContentContainer>
  </Flex>
);
