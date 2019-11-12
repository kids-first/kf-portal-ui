import React from 'react';

import Row from 'uikit/Row';
import { styleComponent } from 'components/Utils';

import { cardHeaderRow, cardHeading, cardBadge } from './Card.module.css';

const HeaderRow = styleComponent(Row, cardHeaderRow);
const Heading = styleComponent('h2', cardHeading);

export const Badge = styleComponent('div', cardBadge);

const CardHeader = ({ title, badge = null, children, className, ...props }) => (
  <HeaderRow className={className}>
    <Heading {...props}>{title}</Heading>
    {badge && <Badge>{badge}</Badge>}
  </HeaderRow>
);

export default CardHeader;
