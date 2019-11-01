import React from 'react';
// import { position, flex, alignItems, justifyContent } from 'styled-system';

import { Flex } from './Core';

import { flexColumn, flexCenter } from 'src/theme/tempTheme.module.css';

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
// ${position};
// ${alignItems};
// ${justifyContent};
// ${flex};
