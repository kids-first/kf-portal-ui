import React from 'react';

import { IconProps } from 'components/Icons';

const ModifierBadgeIcon = ({ svgClass = '', width = 10, height = 10 }: IconProps) => (
  <svg
    className={svgClass}
    width={width}
    height={height}
    viewBox="0 0 10 10"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5" cy="5.00012" r="4" />
  </svg>
);

export default ModifierBadgeIcon;
