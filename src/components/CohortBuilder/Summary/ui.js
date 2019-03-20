import React from 'react';
import styled from 'react-emotion';
import Card from 'uikit/Card';
import CardHeader, { Badge } from 'uikit/Card/CardHeader';
import { HeaderWrapper, CardWrapper } from 'uikit/Card/styles';
import Column from 'uikit/Column';
import Spinner from 'react-spinkit';
import { withTheme } from 'emotion-theming';

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

const Loader = styled(Column)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
`;

export const CohortCard = withTheme(
  ({ title, badge, children, theme, long = false, loading = false, ...props }) => (
    <Card
      CardWrapper={long ? LongCard : MediumCard}
      HeaderWrapper={CohortHeaderWrapper}
      Header={<CohortCardHeader title={title} badge={badge} />}
      {...props}
    >
      {loading ? (
        <Loader>
          <Spinner
            name="circle"
            color={theme.greyScale11}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </Loader>
      ) : (
        children
      )}
    </Card>
  ),
);

export const getCohortBarColors = (data, theme) => {
  const { chartColors } = theme;
  const hasProbands = data.some(d => d.probands !== 0);
  const hasFamilyMembers = data.some(d => d.familyMembers !== 0);
  const colors = [];
  if (hasProbands) colors.push(chartColors.blue);
  if (hasFamilyMembers) colors.push(chartColors.purple);
  return colors;
};
