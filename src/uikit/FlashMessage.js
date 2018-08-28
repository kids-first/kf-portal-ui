import React from 'react';
import styled from 'react-emotion';

import { Box } from './Core';

const FlashMessage = styled(Box)`
  border-left: 5px solid ${({ theme }) => theme.tertiary};
  background-color: ${({ theme }) => theme.optionSelected};
  font-size: 15px;
  line-height: 28px;
  font-family: 'Open Sans', sans-serif;
`;

export default ({ children, ...props }) => (
  <FlashMessage p={3} lineHeight={2} {...props}>
    {children}
  </FlashMessage>
);
