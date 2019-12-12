import React from 'react';

import Row from 'uikit/Row';
import { styleComponent } from 'components/Utils';

import './Multicard.css';

const Title = styleComponent('h2', 'multicardTitle');
const Badge = styleComponent('div', 'multicardBadge');

const MultiHeader = ({ headings, children, ...rest }) => (
  <Row>
    {headings.map((heading, i) => (
      <div key={i}>
        <Title {...rest} ml={i !== 0 ? '30px' : 0}>
          {heading.title}
        </Title>
        {heading.badge !== null ? <Badge>{heading.badge}</Badge> : null}
      </div>
    ))}
  </Row>
);

export default MultiHeader;
