import React from 'react';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';

const Heading = applyDefaultStyles(styled('h2')`
  margin-top: 0;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.cardTitle};
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
  padding-bottom: 20px;
  width: 100%;
`);

const CardHeader = ({ title, ...rest }) => <Heading {...rest}>{title}</Heading>;

export default CardHeader;
