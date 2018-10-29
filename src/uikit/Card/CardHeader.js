import React from 'react';
import styled from 'react-emotion';

const Heading = styled('h2')`
  margin-top: 0;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.cardTitle};
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
  padding-bottom: 20px;
  width: 100%;
`;

const CardHeader = ({ title }) => <Heading>{title}</Heading>;

export default CardHeader;
