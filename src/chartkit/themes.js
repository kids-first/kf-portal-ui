export const ChartColors = {
  blue: '#1f9bb6',
  purple: '#e3429b',
  gridGrey: '#e7e8ec',
  axisGrey: '#a9acbd',
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
      fontSize: '10px',
    },
  },
  // Used by Nivo
  axis: {
    domain: {
      line: {
        stroke: ChartColors.axisGrey,
        strokeWidth: 2,
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
