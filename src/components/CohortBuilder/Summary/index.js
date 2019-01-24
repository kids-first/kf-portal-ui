import React from 'react';
import styled from 'react-emotion';
import Pie from './pie';
import { demographicPiesMock } from './pie';
import Card from 'uikit/Card';

const CardGrid = styled('div')`
  width: 100%;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 9px;
`;

const CardSlot = styled(Card)`
  height: 305px;

  &.last-full-height {
    height: 100%;
    grid-column: 4/5;
    grid-row: 1/3;
  }
`;

const Summary = () => (
  <CardGrid>
    <CardSlot>
      <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
    </CardSlot>
    <CardSlot>
      {' '}
      <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
    </CardSlot>
    <CardSlot>
      {' '}
      <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
    </CardSlot>
    <CardSlot>
      {' '}
      <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
    </CardSlot>
    <CardSlot>
      {' '}
      <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
    </CardSlot>
    <CardSlot>
      {' '}
      <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
    </CardSlot>
    <CardSlot className="last-full-height">long</CardSlot>
  </CardGrid>
);

export default Summary;
