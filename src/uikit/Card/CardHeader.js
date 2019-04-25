import React from 'react';
import styled from 'react-emotion';
import { applyDefaultStyles } from 'uikit/Core';
import Row from 'uikit/Row';

const HeaderRow = styled(Row)`
  font-size: 20px;
`;

const Heading = applyDefaultStyles(styled('h2')`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 100%;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.cardTitle};
  margin: 0;
`);

export const Badge = applyDefaultStyles(styled('div')`
  margin-left: 9px;
  display: inline-block;
  padding: 0;
  color: white;
  font-weight: 600;
  font-size: 60%;
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

const CardHeader = ({ title, badge = null, children, className, ...rest }) => (
  <HeaderRow className={className}>
    <Heading {...rest}>{title}</Heading>
    {badge !== null ? <Badge>{badge}</Badge> : null}
  </HeaderRow>
);

export default CardHeader;
