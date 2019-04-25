import React from 'react';
import { storiesOf } from '@storybook/react';

// import ProgressBar from '/src/chartkit/components/ProgressBar';
import ProgressBar from '../../src/chartkit/components/ProgressBar';

const FixedHeightWrapper = ({ children }) => (
  <div style={{ height: '200px', width: '200px' }}>{children}</div>
);

storiesOf('ChartKit/ProgressBar', module).add('default', () => (
  <FixedHeightWrapper>
    <ProgressBar height={10} percent={67} onClick={x => x} />
  </FixedHeightWrapper>
));

storiesOf('ChartKit/ProgressBar', module).add('on click', () => (
  <FixedHeightWrapper>
    <ProgressBar height={40} percent={67} onClick={x => alert('Clicked Progress Bar')} />
  </FixedHeightWrapper>
));
