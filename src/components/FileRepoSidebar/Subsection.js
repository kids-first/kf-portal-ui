import React from 'react';
import styled from 'react-emotion';
import { H4 } from 'uikit/Typography';

const Container = styled('div')`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Body = styled(`div`)`
  display: flex;
  padding-top: 5px;
`;

export default ({ heading, children }) => (
  <Container>
    <H4 my="0" color="greyScale1" fontWeight="regular">
      {heading}
    </H4>
    <Body>{children}</Body>
  </Container>
);
