import React from 'react';
import { storiesOf } from '@storybook/react';

import { Pie } from '../../src/components/charts';

import { demographicPiesMock } from './mocks';

const FullscreenWrapper = ({ children }) => (
  <div style={{ height: '100vh', width: '100vw' }}>{children}</div>
);

storiesOf('Charts/Pie', module).add('Ethnicity', () => (
  <FullscreenWrapper>
    <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
  </FullscreenWrapper>
));

storiesOf('Charts/Pie', module).add('Family Composition', () => (
  <FullscreenWrapper>
    <Pie data={demographicPiesMock.familyComposition} colors={'blues'} />
  </FullscreenWrapper>
));

storiesOf('Charts/Pie', module).add('Gender', () => (
  <FullscreenWrapper>
    <Pie data={demographicPiesMock.gender} colors={'oranges'} />
  </FullscreenWrapper>
));

storiesOf('Charts/Pie', module).add('Race', () => (
  <FullscreenWrapper>
    <Pie data={demographicPiesMock.race} colors={'red_purple'} />
  </FullscreenWrapper>
));
