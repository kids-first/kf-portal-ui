import * as React from 'react';
import styled from 'react-emotion';

import { Flex } from 'uikit/Core';
import { ContentContainer } from 'theme/tempTheme';

const TitleBar = styled(Flex)`
  height: 104px;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

export default ({ children }) => (
  <TitleBar>
    <ContentContainer>{children}</ContentContainer>
  </TitleBar>
);
