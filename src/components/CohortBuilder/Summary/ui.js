import React from 'react';
import Spinner from 'react-spinkit';

import Card from 'uikit/Card';
import CardHeader from 'uikit/Card/CardHeader';
import { HeaderWrapper, CardWrapper } from 'uikit/Card/styles';
import Column from 'uikit/Column';

import { styleComponent } from 'components/Utils';

import './Summary.css';

export const BarChartContainer = styleComponent('div', 'barChartContainer');
const LongCard = styleComponent(CardWrapper, 'longCard');
const MediumCard = styleComponent(CardWrapper, 'mediumCard');
const CohortHeaderWrapper = styleComponent(HeaderWrapper, 'cohortHeaderWrapper');
const CohortCardHeader = styleComponent(CardHeader, 'cohortCardHeader');
const Loader = styleComponent(Column, 'cohortCardLoader');

export const CohortCard = ({ title, badge, children, long = false, loading = false, ...props }) => (
  <Card
    CardWrapper={long ? LongCard : MediumCard}
    HeaderWrapper={CohortHeaderWrapper}
    Header={<CohortCardHeader title={title} badge={badge} />}
    {...props}
  >
    {loading ? (
      <Loader>
        <Spinner name="circle" color="#a9adc0" style={{ width: 50, height: 50 }} />
      </Loader>
    ) : (
      children
    )}
  </Card>
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
