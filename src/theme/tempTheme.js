/**
 * This file lists components that comes from mixins in
 *  src/theme/defaultTheme.js, to be used while we decomission emotion.
 */
import React from 'react';

import Row from 'uikit/Row';
import Column from 'uikit/Column';

import { contentContainer } from './tempTheme.module.css';

export const ContentContainer = ({ children, className = '', ...props }) => (
  <Row className={`${contentContainer} ${className}`} {...props}>
    {children}
  </Row>
);

export const ContentContainerColumn = ({ children, className = '', ...props }) => (
  <Column className={`${contentContainer} ${className}`} {...props}>
    {children}
  </Column>
);
