import React from 'react';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import { ChartColors } from 'chartkit/themes';

export const StudiesChart = ({ data }) => (
  <HorizontalBar
    data={data}
    indexBy="name"
    keys={['probands', 'familyMembers']}
    colors={[ChartColors.blue, ChartColors.purple]}
    tickValues={[0, 250, 500, 750, 1000, 1250]}
    xTickTextLength={22}
    legends={[
      { title: 'Probands', color: ChartColors.blue },
      { title: 'Family Members', color: ChartColors.purple },
    ]}
  />
);
