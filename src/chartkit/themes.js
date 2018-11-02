import { chartColors } from '../theme/defaultTheme';

const defaultText = {
  fill: chartColors.tickTextGrey,
  fontSize: 11,
  fontFamily: 'Open Sans',
};

export const defaultTheme = {
  // Not used by Nivo
  legend: {
    itemWidth: 50,
    itemHeight: 10,
    itemsSpacing: 1,
    iconSize: 10,
    icon: {},
    text: {
      ...defaultText,
    },
  },
  // Used by Nivos
  axis: {
    domain: {
      line: {
        stroke: chartColors.axisGrey,
        strokeWidth: 2,
      },
    },
    ticks: {
      text: {
        ...defaultText,
      },
    },
  },
  grid: {
    line: {
      stroke: chartColors.gridGrey,
      strokeWidth: 2,
    },
  },
};
