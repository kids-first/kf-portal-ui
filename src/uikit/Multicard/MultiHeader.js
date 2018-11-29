import React from 'react';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Row from 'uikit/Row';

const Title = applyDefaultStyles(styled('h2')`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.cardTitle};
  margin: 0;
`);

const Badge = applyDefaultStyles(styled('div')`
  margin-left: 9px;
  display: inline-block;
  padding: 0;
  color: white;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  font-family: ${({ theme }) => theme.fonts.details};
  background-color: ${({ theme }) => theme.defaultBadge};
  border-radius: 50px;
  position: relative;
  height: 25px;
  min-width: 25px;
  line-height: 25px;
  padding: 0 0.4em;
`);

const Header = applyDefaultStyles(styled(Row)`
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
  padding-bottom: 20px;
`);

const MultiHeader = ({ headings, children, ...rest }) => (
  <Header>
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
    <Row>{children}</Row>
  </Header>
);

export default MultiHeader;
