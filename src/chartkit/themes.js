import { chartColors } from '../theme/defaultTheme';

const defaultText = {
  fill: chartColors.tickTextGrey,
  fontSize: 11,
  fontFamily: 'Open Sans',
};

const defaultText = {
  fill: chartColors.tickTextGrey,
  fontSize: 11,
  fontFamily: 'Open Sans',
};

export const defaultTheme = {
  // Not used by Nivo
  legend: {
    itemWidth: 40,
    itemHeight: 10,
    itemsSpacing: 1,
    iconSize: 10,
    icon: {},
    text: {
      ...defaultText,
    },
    style: {
      backgroundColor: '#f4f5f8',
      marginBottom: '20px',
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
  tooltip: {
    container: {
      background: 'white',
      color: '#404c9a',
      fontSize: 'inherit',
      borderRadius: '2px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
      padding: '5px 9px',
    },
  },
};
