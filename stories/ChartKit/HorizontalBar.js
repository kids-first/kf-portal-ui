import React from 'react';
import { storiesOf } from '@storybook/react';

import HorizontalBar from '../../src/chartkit/components/HorizontalBar';
import { chartColors } from '../../src/theme/defaultTheme';

export const bar = {};

export const actions = {};

const FixedHeightWrapper = ({ children }) => <div style={{ height: '300px' }}>{children}</div>;

const mock = [
  {
    name: 'Pediatric Brain Tumors: CBTTC',
    probands: 10,
    familyMembers: 100,
  },
  {
    name: 'Orofacial Cleft: European Ancestry',
    probands: 102,
    familyMembers: 167,
  },
  {
    name: 'Ewing Sarcoma: Genetic Risk',
    probands: 23,
    familyMembers: 630,
  },
  {
    name: 'Syndromic Cranial Dysinnervation',
    probands: 430,
    familyMembers: 500,
  },
  {
    name: 'Congenital Heart Defects',
    probands: 230,
    familyMembers: 550,
  },
  {
    name: 'Adolescent nameiopathic Scoliosis',
    probands: 340,
    familyMembers: 400,
  },
  {
    name: 'Congenital Diaphragmatic Hernia',
    probands: 60,
    familyMembers: 420,
  },
];

storiesOf('ChartKit/HorizontalBar', module).add('default', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={mock}
      indexBy="name"
      keys={['probands', 'familyMembers']}
      colors={[chartColors.blue, chartColors.purple]}
      tickValues={[0, 250, 500, 750, 1000, 1250]}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: chartColors.blue },
        { title: 'Family Members', color: chartColors.purple },
      ]}
      padding={0.7}
    />
  </FixedHeightWrapper>
));
