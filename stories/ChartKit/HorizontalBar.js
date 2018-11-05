import React from 'react';
import { storiesOf } from '@storybook/react';
import _ from 'lodash';

import HorizontalBar from '../../src/chartkit/components/HorizontalBar';
import { chartColors } from '../../src/theme/defaultTheme';

export const bar = {};

export const actions = {};

const FixedHeightWrapper = ({ children }) => <div style={{ height: '300px' }}>{children}</div>;

const randMax = 200;
const mock = [
  {
    name: 'Pediatric Brain Tumors: CBTTC',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    name: 'Orofacial Cleft: European Ancestry',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    name: 'Ewing Sarcoma: Genetic Risk',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    name: 'Syndromic Cranial Dysinnervation',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    name: 'Congenital Heart Defects',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    name: 'Adolescent nameiopathic Scoliosis',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    name: 'Congenital Diaphragmatic Hernia',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
];

storiesOf('ChartKit/HorizontalBar', module).add('default', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={mock}
      indexBy="name"
      keys={['probands', 'familyMembers']}
      colors={[chartColors.blue, chartColors.purple]}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: chartColors.blue },
        { title: 'Family Members', color: chartColors.purple },
      ]}
      padding={0.4}
    />
  </FixedHeightWrapper>
));
