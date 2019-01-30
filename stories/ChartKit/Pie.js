import React from 'react';
import { storiesOf } from '@storybook/react';

import Pie from '../../src/chartkit/components/Pie';

import { demographicPiesMock } from './mocks';

storiesOf('Charts/Pie', module).add('Ethnicity', () => (
  <Pie data={demographicPiesMock.ethnicity} colors={['#F79122','#FFFFFF']} />
));

storiesOf('Charts/Pie', module).add('Family Composition', () => (
  <Pie data={demographicPiesMock.familyComposition} colors={['#2B388F','#FFFFFF']} />
));

storiesOf('Charts/Pie', module).add('Gender', () => (
  <Pie data={demographicPiesMock.gender} colors={['#A6278F','#FFFFFF']} />
));

storiesOf('Charts/Pie', module).add('Race', () => (
  <Pie data={demographicPiesMock.race} colors={['#00ACEB','#FFFFFF']} />
));

storiesOf('Charts/Pie', module).add('4 Pies', () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', height: '100%', marginTop: '5px' }}>
    <Pie style={{ height: '45%', width: '50%' }} title={"Gender"} data={demographicPiesMock.gender} colors={['#F79122','#FFFFFF']} />
    <Pie style={{ height: '45%', width: '50%' }} title={"Ethnicity"} data={demographicPiesMock.ethnicity} colors={['#2B388F','#FFFFFF']} />
    <Pie style={{ height: '45%', width: '50%' }} title={"Race"} data={demographicPiesMock.race} colors={['#A6278F','#FFFFFF']} />
    <Pie style={{ height: '45%', width: '50%' }} title={"Family Composition"} data={demographicPiesMock.familyComposition} colors={['#00ACEB','#FFFFFF']} />
  </div>
));