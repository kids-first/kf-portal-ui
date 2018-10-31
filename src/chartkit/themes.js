export const ChartColors = {
  blue: '#1f9bb6',
  purple: '#e3429b',
  gridGrey: '#e7e8ec',
  axisGrey: '#a9acbd',
  tickTextGrey: '#343434',
};

const defaultText = {
  fill: ChartColors.tickTextGrey,
  fontSize: 11,
  fontFamily: 'Open Sans',
};

export const defaultTheme = {
  // Not used by Nivo
  legend: {
    itemWidth: 50,
    itemHeight: 10,
    itemsSpacing: 5,
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
        stroke: ChartColors.axisGrey,
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
      stroke: ChartColors.gridGrey,
      strokeWidth: 2,
    },
  },
};
