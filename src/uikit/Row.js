import React from 'react';

import { Flex } from './Core';

import { flexRow, flexCenter } from '../../src/theme/tempTheme.module.css';

export default ({ children, center = false, className = '', style = {}, ...props }) => (
  <Flex
    className={`${flexRow} ${center ? flexCenter : ''} ${className}`}
    style={{
      minHeight: 0,
      ...style,
    }}
    {...props}
  >
    {children}
  </Flex>
);
