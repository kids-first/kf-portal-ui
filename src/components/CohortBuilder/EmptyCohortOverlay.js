import React from 'react';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

const StyleOverlay = styled('div')`
  background-color: rgba(255, 255, 255, 0.75);
  position: absolute;
  width: 100vw;
  height: 100%;
  left: 0;
  z-index: 101;
  display: flex;
  justify-content: center;
`;

const StyleMessage = styled('div')`
  margin-top: 100px;
  z-index: 1002;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px 35px;
  font-weight: 600;
  background-color: #fff;
  max-height: fit-content;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.default}, sans-serif;
  height: 50px;
`;

const EmptyCohortOverlay = withTheme(({ theme }) => (
  <StyleOverlay>
    <StyleMessage>There are no participants for this cohort.</StyleMessage>
  </StyleOverlay>
));

export default EmptyCohortOverlay;
