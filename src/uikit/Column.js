import React from 'react';

import { Flex } from './Core';

import { flexColumn, flexCenter } from 'theme/tempTheme.module.css';

export default ({ children, center = false, scrollY = false, className = '', ...props }) => (
  <Flex
    className={`${flexColumn} ${center ? flexCenter : ''} ${className}`}
    style={{
      ...(scrollY ? { overflowY: 'scroll' } : {}),
    }}
    {...props}
  >
    {children}
  </Flex>
);
