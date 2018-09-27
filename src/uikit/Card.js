import React from 'react';
import styled from 'react-emotion';
import { Flex } from './Core';

const CardContainer = styled(Flex)`
  border-radius: 10px;
  background-color: #ffffff;
  border: solid 1px #e0e1e6;
  flex: 1;
  min-height: 440px;
`;

const Card = ({ children, ...props }) => <CardContainer {...props}>{children}</CardContainer>;

export default Card;
