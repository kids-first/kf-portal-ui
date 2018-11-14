import React from 'react';
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';
import _ from 'lodash';

import { serverMock, randomMock, smallNumberMock, largeNumberMock } from './mocks';

import HorizontalBar from '../../src/chartkit/components/HorizontalBar';
import { chartColors } from '../../src/theme/defaultTheme';

const FixedHeightWrapper = ({ children }) => (
  <div style={{ height: '300px', padding: '25px' }}>{children}</div>
);

storiesOf('ChartKit/HorizontalBar', module).add('default', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={serverMock}
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

/**
 * Examples of merging static data with data from API
 */
const localMock = [
  { id: 'a', url: 'www.google.ca' },
  { id: 'b', url: 'www.duckduckgo.com' },
  { id: 'c', url: 'www.bbc.com' },
];

const mergedMockData = serverMock.map(d => ({ ...d, ..._.find(localMock, { id: d.id }) }));

const onClickMock = barData => {
  action('Clicking bar');
};

storiesOf('ChartKit/HorizontalBar', module).add('onClick', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={mergedMockData}
      indexBy="id"
      keys={['probands', 'familyMembers']}
      colors={[chartColors.blue, chartColors.purple]}
      onClick={onClickMock}
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

storiesOf('ChartKit/HorizontalBar', module).add('Custom Ordering', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={randomMock}
      indexBy="id"
      keys={['probands', 'familyMembers']}
      colors={[chartColors.blue, chartColors.purple]}
      sortBy={(a, b) => {
        const aTotal = a.probands + a.familyMembers;
        const bTotal = b.probands + b.familyMembers;
        return aTotal <= bTotal ? 1 : -1;
      }}
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

storiesOf('ChartKit/HorizontalBar', module).add('Large numbers', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={largeNumberMock}
      indexBy="id"
      tickInterval={5}
      keys={['probands', 'familyMembers']}
      colors={[chartColors.blue, chartColors.purple]}
      sortBy={(a, b) => {
        const aTotal = a.probands + a.familyMembers;
        const bTotal = b.probands + b.familyMembers;
        return aTotal <= bTotal ? 1 : -1;
      }}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: chartColors.blue },
        { title: 'Family Members', color: chartColors.purple },
      ]}
      padding={0.4}
    />
  </FixedHeightWrapper>
));

storiesOf('ChartKit/HorizontalBar', module).add('Small numbers', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={smallNumberMock}
      indexBy="id"
      keys={['probands', 'familyMembers']}
      colors={[chartColors.blue, chartColors.purple]}
      sortBy={(a, b) => {
        const aTotal = a.probands + a.familyMembers;
        const bTotal = b.probands + b.familyMembers;
        return aTotal <= bTotal ? 1 : -1;
      }}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: chartColors.blue },
        { title: 'Family Members', color: chartColors.purple },
      ]}
      padding={0.4}
    />
  </FixedHeightWrapper>
));

storiesOf('ChartKit/HorizontalBar', module).add('tool tip formatter', () => (
  <FixedHeightWrapper>
    <HorizontalBar
      data={randomMock}
      tooltipFormatter={data => {
        const participants = data.familyMembers + data.probands;
        return `${participants.toLocaleString()} participant${participants > 1 ? 's' : ''}`;
      }}
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
