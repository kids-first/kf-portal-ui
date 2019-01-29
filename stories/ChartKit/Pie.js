import React from 'react';
import { storiesOf } from '@storybook/react';

import Pie from '../../src/chartkit/components/Pie';

import { demographicPiesMock } from './mocks';

storiesOf('Charts/Pie', module).add('Ethnicity', () => (
  <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
));

storiesOf('Charts/Pie', module).add('Family Composition', () => (
  <Pie data={demographicPiesMock.familyComposition} colors={'blues'} />
));

storiesOf('Charts/Pie', module).add('Gender', () => (
  <Pie data={demographicPiesMock.gender} colors={'oranges'} />
));

storiesOf('Charts/Pie', module).add('Race', () => (
  <Pie data={demographicPiesMock.race} colors={'red_purple'} />
));

storiesOf('Charts/Pie', module).add('4 Pies', () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', height: '100%', marginTop: '5px' }}>
    <Pie style={{ height: '45%', width: '50%' }} title={"Gender"} data={demographicPiesMock.ethnicity} colors={'purples'} />
    <Pie style={{ height: '45%', width: '50%' }} title={"Ethnicity"} data={demographicPiesMock.familyComposition} colors={'blues'} />
    <Pie style={{ height: '45%', width: '50%' }} title={"Race"} data={demographicPiesMock.gender} colors={'oranges'} />
    <Pie style={{ height: '45%', width: '50%' }} title={"Family Composition"} data={demographicPiesMock.race} colors={'red_purple'} />
  </div>
));