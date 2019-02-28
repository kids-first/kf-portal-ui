import React from 'react';
import styled from 'react-emotion';
import Card from 'uikit/Card';
import { Col, Row } from 'react-grid-system';
import CardHeader, { Badge } from 'uikit/Card/CardHeader';
import { HeaderWrapper, CardWrapper } from 'uikit/Card/styles';

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

export const CardSlot = MediumCard;

export const PaddedColumn = styled(Col)`
  padding: 4px !important;
`;

const LongCard = styled(CardWrapper)`
  width: 100%;
  height: 100%;
`;

const MediumCard = styled(CardWrapper)`
  height: 305px;
  min-height: 305px;
  padding: 15px 20px;
`;

const CohortHeaderWrapper = styled(HeaderWrapper)`
  padding-bottom: 12px;
`;

const CohortCardHeader = styled(CardHeader)`
  font-size: 16px;

  ${Badge} {
    line-height: 20px;
    height: 20px;
    min-width: 20px;
  }
`;

export const CohortCard = ({ title, badge, children, long = false, ...props }) => (
  <Card
    CardWrapper={long ? LongCard : MediumCard}
    HeaderWrapper={CohortHeaderWrapper}
    Header={<CohortCardHeader title={title} badge={badge} />}
    {...props}
  >
    {children}
  </Card>
);
