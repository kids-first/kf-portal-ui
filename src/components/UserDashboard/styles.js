import React from 'react';
import styled from 'react-emotion';
import { H3 } from '../../uikit/Typography';

export const IntegrationsDiv = styled.div`
  ${({ theme }) => theme.row};
  justify-content: space-around;
  align-items: center;
`;

export const IntegrationsCircleDiv = styled.div`
  width: 82px;
  height: 82px;
  flex: none;
  border-radius: 100%;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: center;
  border: solid 1px ${({ theme }) => theme.colors.greyScale5};
`;
