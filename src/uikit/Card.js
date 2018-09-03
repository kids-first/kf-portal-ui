import React from 'react';
import styled from 'react-emotion';
import { Flex } from './Core';

const CardContainer = styled(Flex)`
  border-radius: 10px;
  background-color: #ffffff;
  border: solid 1px #e0e1e6;
`;

const CardHeading = styled('div')``;

const CardContent = styled('div')``;

const Card = ({ heading, content }) => (
  <CardContainer>
    <CardHeading>{heading}</CardHeading>
    <CardContent>{content}</CardContent>
  </CardContainer>
);

export default Card;
