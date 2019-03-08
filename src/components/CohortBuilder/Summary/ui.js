import React from 'react';
import styled from 'react-emotion';
import Card from 'uikit/Card';
import CardHeader, { Badge } from 'uikit/Card/CardHeader';
import { HeaderWrapper, CardWrapper } from 'uikit/Card/styles';
import { chartColors } from 'theme/defaultTheme';

export const BarChartContainer = styled('div')`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 20px;
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

const cohortChartColors = {
  proband: chartColors.blue,
  familyMembers: chartColors.purple,
};

export const getCohortBarColors = data => {
  const hasProbands = data.some(d => d.probands !== 0);
  const hasFamilyMembers = data.some(d => d.familyMembers !== 0);
  const colors = [];
  if (hasProbands) colors.push(cohortChartColors.proband);
  if (hasFamilyMembers) colors.push(cohortChartColors.familyMembers);
  return colors;
};
