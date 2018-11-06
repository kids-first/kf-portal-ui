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

/*
old mock
const mock = [
  {
    id: 'Pediatric Brain Tumors: CBTTC',
    probands: 10, //_.random(0, randMax),
    familyMembers: 10, //_.random(0, randMax),
  },
  {
    id: 'Orofacial Cleft: European Ancestry',
    probands: 30, //_.random(0, randMax),
    familyMembers: 30, //_.random(0, randMax),
  },
  {
    id: 'Ewing Sarcoma: Genetic Risk',
    probands: 60, //_.random(0, randMax),
    familyMembers: 60, //_.random(0, randMax),
  },
  {
    id: 'Syndromic Cranial Dysinnervation',
    probands: 120, //_.random(0, randMax),
    familyMembers: 120, // _.random(0, randMax),
  },
  {
    id: 'Congenital Heart Defects',
    probands: 170, //_.random(0, randMax),
    familyMembers: 170, // _.random(0, randMax),
  },
  {
    id: 'Adolescent nameiopathic Scoliosis',
    probands: 240, //_.random(0, randMax),
    familyMembers: 240, // _.random(0, randMax),
  },
  {
    id: 'Congenital Diaphragmatic Hernia',
    random: 'xx',
    probands: 350, //_.random(0, randMax),
    familyMembers: 350, // _.random(0, randMax),
  },
];
*/

const randMax = 2100;
const mock = [
  {
    id: 'a',
    probands: 10, //_.random(0, randMax),
    familyMembers: 10, //_.random(0, randMax),
  },
  {
    id: 'b',
    probands: 30, //_.random(0, randMax),
    familyMembers: 30, //_.random(0, randMax),
  },
  {
    id: 'c',
    probands: 60, //_.random(0, randMax),
    familyMembers: 60, //_.random(0, randMax),
  },
  {
    id: 'd',
    probands: 120, //_.random(0, randMax),
    familyMembers: 120, // _.random(0, randMax),
  },
  {
    id: 'e',
    probands: 170, //_.random(0, randMax),
    familyMembers: 170, // _.random(0, randMax),
  },
  {
    id: 'f',
    probands: 240, //_.random(0, randMax),
    familyMembers: 240, // _.random(0, randMax),
  },
  {
    id: 'g',
    random: 'xx',
    probands: 350, //_.random(0, randMax),
    familyMembers: 350, // _.random(0, randMax),
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
