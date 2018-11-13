import React from 'react';
import { withTheme } from 'emotion-theming';

import HorizontalBar from 'chartkit/components/HorizontalBar';
import { defaultTheme } from 'chartkit/themes';

const theme = { ...defaultTheme, ...{} };

export const StudiesChart = withTheme(({ data, theme }) => (
  <HorizontalBar
    data={data}
    indexBy="name"
    keys={['probands', 'familyMembers']}
    tickInterval={4}
    padding={15}
    colors={[theme.chartColors.blue, theme.chartColors.purple]}
    xTickTextLength={28}
    legends={[
      { title: 'Probands', color: theme.chartColors.blue },
      { title: 'Family Members', color: theme.chartColors.purple },
    ]}
    padding={0.7}
    theme={theme}
  />
));
