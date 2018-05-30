import React from 'react';
import styled from 'react-emotion';

import Heading from 'uikit/Heading';

const Container = styled('div')`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const StyledHeading = styled(Heading)`
  color: ${({ theme }) => theme.greyScale1};
  font-size: 14px;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const Body = styled(`div`)`
  display: flex;
  padding-top: 5px;
`;

export default ({ heading, children }) => (
  <Container>
    <StyledHeading>{heading}</StyledHeading>
    <Body>{children}</Body>
  </Container>
);
