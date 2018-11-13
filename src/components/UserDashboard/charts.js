import React from 'react';
import { withTheme } from 'emotion-theming';

import HorizontalBar from 'chartkit/components/HorizontalBar';

export const StudiesChart = withTheme(({ data, theme }) => (
  <HorizontalBar
    data={data}
    indexBy="name"
    keys={['probands', 'familyMembers']}
    colors={[theme.chartColors.blue, theme.chartColors.purple]}
    tickValues={[0, 250, 500, 750, 1000, 1250]}
    xTickTextLength={28}
    legends={[
      { title: 'Probands', color: theme.chartColors.blue },
      { title: 'Family Members', color: theme.chartColors.purple },
    ]}
    padding={0.7}
  />
));
