import React from 'react';
import { css } from 'emotion';

export default ({ size = 15, fill = '#a9adc0', className = '', ...props }) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 86"
    className={`${css`
      width: ${size}px;
      height: ${size}px;
      fill: ${fill};
    `} ${className}`}
  >
    <title>icon-copy-clipboard</title>
    <path d="M32,0a7,7,0,0,0-7,7v3H21.09l-2.5,4H45.41l-2.5-4H39V7A7,7,0,0,0,32,0Zm0,4a3,3,0,0,1,3,3v3H29V7A3,3,0,0,1,32,4ZM0,12V86H64V75H30a2.07,2.07,0,0,1-2-2V31a2.07,2.07,0,0,1,1.81-2H60a2.06,2.06,0,0,1,1.41.56L64,32.16V12H48.84l1.85,2.94A2,2,0,0,1,49,18H15a2,2,0,0,1-2-2,1.94,1.94,0,0,1,.3-1.05L15.16,12ZM32,33V71H72V49H58a2.07,2.07,0,0,1-2-2V33Zm28,.81V45H71.19ZM39.72,45H50a2,2,0,1,1,0,4H40a2.08,2.08,0,0,1-2.12-1.88A2,2,0,0,1,39.72,45Zm0,8H64a2,2,0,1,1,0,4H40a2.08,2.08,0,0,1-2.12-1.88A2,2,0,0,1,39.72,53Zm0,8H64a2,2,0,1,1,0,4H40a2.08,2.08,0,0,1-2.12-1.88A2,2,0,0,1,39.72,61Z" />
  </svg>
);
