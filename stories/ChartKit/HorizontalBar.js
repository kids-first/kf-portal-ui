import React from 'react';
import { storiesOf } from '@storybook/react';
import _ from 'lodash';

import HorizontalBar from '../../src/chartkit/components/HorizontalBar';
import { chartColors } from '../../src/theme/defaultTheme';

export const bar = {};

export const actions = {};

const FixedHeightWrapper = ({ children }) => (
  <div style={{ height: '300px', padding: '25px' }}>{children}</div>
);

const randMax = 2100;
const mock = [
  {
    id: 'Pediatric Brain Tumors: CBTTC',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Orofacial Cleft: European Ancestry',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Ewing Sarcoma: Genetic Risk',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Syndromic Cranial Dysinnervation',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Congenital Heart Defects',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Adolescent nameiopathic Scoliosis',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Congenital Diaphragmatic Hernia',
    random: 'xx',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
];

storiesOf('ChartKit/HorizontalBar', module).add('default', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={mock}
      indexBy="id"
      keys={['probands', 'familyMembers']}
      colors={[chartColors.blue, chartColors.purple]}
      tickInterval={5}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: chartColors.blue },
        { title: 'Family Members', color: chartColors.purple },
      ]}
      padding={0.4}
    />
  </FixedHeightWrapper>
));
