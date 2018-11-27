import React from 'react';
import { storiesOf } from '@storybook/react';

import ProgressBar from '../../src/chartkit/components/ProgressBar';

const FixedHeightWrapper = ({ children }) => (
  <div style={{ height: '200px', width: '200px' }}>{children}</div>
);

storiesOf('ChartKit/ProgressBar', module).add('default', () => (
  <FixedHeightWrapper>
    <ProgressBar style={{ height: 40 }} percent={67} onHover={x => x} onClick={x => x} />
  </FixedHeightWrapper>
));
