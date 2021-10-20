import React from 'react';

import { IconProps } from '../../icons';

const HighBadgeIcon = ({ svgClass = '', fill = '' }: IconProps) => (
  <svg
    className={svgClass}
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 1.00012L0 9.00012H10L5 1.00012Z" fill={fill} />
  </svg>
);

export default HighBadgeIcon;
