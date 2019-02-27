import React from 'react';
import styled, { css } from 'react-emotion';
import Card from 'uikit/Card';
import { Col, Row } from 'react-grid-system';
import CardHeader from '../../../uikit/Card/CardHeader';

export const spacing = {
  md: 6,
  lg: 4,
};

export const BarChartContainer = styled('div')`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
`;

export const CardSlot = styled(Card)`
  ${mediumCard}
`;

export const PaddedColumn = styled(Col)`
  padding: 4px !important;
`;

const LongCard = styled(Card)`
  width: 100%;
`;

export const LongCardContainerRow = styled(Row)`
  height: 100%;
`;

const longCard = props =>
  css`
    width: 100%;
  `;
const mediumCard = props =>
  css`
    height: 305px;
    min-height: 305px;
    padding: 15px 20px;
  `;

const headerWrapperStyle = props => css`
  padding-bottom: 10px;
`;

const headingStyle = props =>
  css`
    font-size: 16px;
  `;

export const CohortCard = ({ title, children, long = false, ...props }) => (
  <Card
    cardWrapperStyle={long ? longCard : mediumCard}
    headerWrapperStyle={headerWrapperStyle}
    Header={<CardHeader title={title} headingStyle={headingStyle} />}
    {...props}
  >
    {children}
  </Card>
);
