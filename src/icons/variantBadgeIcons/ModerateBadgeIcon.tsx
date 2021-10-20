import React from 'react';

import { IconProps } from 'icons';

const ModerateBadgeIcon = ({ svgClass = '', fill = '' }: IconProps) => (
  <svg
    className={svgClass}
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 5.00012L5 10.0001L0 5.00012L5 0.00012207L10 5.00012Z" fill={fill} />
  </svg>
);

export default ModerateBadgeIcon;
