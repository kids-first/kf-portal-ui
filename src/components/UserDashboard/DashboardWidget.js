import React from 'react';
import styled, { css } from 'react-emotion';
import { H3 } from '../../uikit/Typography';

export const WidgetTitle = ({ children }) => (
  <H3 p="0" mt="6" fontWeight="thin" fontSize={4} color="secondary">
    {children}
  </H3>
);

const DashboardWidget = ({ theme, profileColors, children }) => (
  <div
    css={`
      max-width: 450px;
      display: flex;
      flex-direction: column;
      margin: 15px 0;
      flex: 3;
      border: 1px solid #e0e1e6;
      border-top: 0;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      padding: 0 10px;
    `}
  >
    <div
      css={`
        display: block;
        width: calc(100% + 22px);
        margin-left: -11px;
        height: 6px;
        background-image: linear-gradient(
          to right,
          ${profileColors.gradientDark},
          ${profileColors.gradientMid} 51%,
          ${profileColors.gradientLight}
        );
      `}
    />

    {children}
  </div>
);

export default DashboardWidget;
