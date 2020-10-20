const colors = {
  white: '#ffffff',
  primary: '#90278e', //magenta
  primaryLight: '#a42c90', //lighter magenta
  secondary: '#2b388f', //purplish blue
  primaryHover: '#404c9a', //purple
  tertiary: '#009bb8', //teal-blue
  highlight: '#e83a9c', //pink
  hover: '#c03299', //also pink
  tertiaryHover: '#19a9c4', //lighter teal-blue
  borderGrey: '#cacbcf',
  backgroundGrey: '#f4f5f8',
  tertiaryBackground: '#edeef1', // light light blue
  lightBlue: '#008199',
  orange: '#ffaa52',
  purple: '#a6278f',

  primaryGradient: `#90278e, #cc3399 35%, #be1e2d 66%, #f6921e`,

  active: '#00afed', //light blue
  inactive: '#dedfe4', //grey

  optionSelected: '#E5F6FD', //light blue

  greyDisabled: '#686868',

  greyScale11: '#a9adc0',
  greyScale10: 'rgb(237,238,241)', //grey for table backgrounds
  greyScale9: '#74757d', //rgb(116, 117, 125) dark grey text on greyScale5
  greyScale8: '#d4d6dd',
  greyScale7: 'rgb(107,98,98)',
  greyScale6: 'rgb(245,245,245)',
  greyScale5: '#e0e1e6',
  greyScale4: 'rgb(212, 214, 221)', //#d4d6dd
  greyScale3: 'rgb(144,144,144)', //not enough contrast on white background
  greyScale2: 'rgb(61,61,61)',
  greyScale1: 'rgb(52, 52, 52)', //#343434
  greyScale0: 'rgb(36,36,36)',

  shadow: 'rgba(0, 0, 0, 0.5)',
  lightShadow: '#a0a0a3',
  lighterShadow: '#bbbbbb',

  // error
  errorDark: '#d8202f', //red
  errorLight: '#fadfe1', //light red (pink) fill
  errorBackground: '#f9dee1',
  errorBorder: `#e45562`,
  // warning
  warningDark: '#ff9427', //yellow
  warningLight: '#ff9427',
  warningBackground: '#fff4e9',
  warningBorder: `#ff9427`,
  // info
  infoDark: '#22afe9', //blue
  infoLight: '#e8f7fd',
  infoBackground: '#e8f7fd',
  infoBorder: `#22afe9`,
  // success
  successDark: '#009bb8', //green
  successLight: '#e6f3f5',
  successBackground: '#e6f3f5',
  successBorder: `#009bb8`,

  cardTitle: '#404c9a',
  defaultBadge: '#404c9a',

  /**
   * Cohort Builder
   */
  filterViolet: '#8f97d1',
  filterPurple: '#404c9a',
  studyRed: '#dd1f2a',
  demographicPurple: '#e53a95',
  clinicalBlue: '#00aceb',
  biospecimenOrange: '#f79122',
  dataBlue: '#009bba',
  uploadYellow: '#edb500',
  borderPurple: '#cc3399',
  linkPurple: '#cc3399',

  // table
  backgroundRowOdd: '#fff',
  backgroundRowEven: '#f4f5f8',
};

export const chartColors = {
  lightblue: '#00ACEB',
  darkblue: '#2b388f',
  lightpurple: '#A6278F',
  orange: '#F79122',
  red: '#dd1f2a',
  blue: '#1f9bb6',
  purple: '#e3429b',
  gridGrey: '#e7e8ec',
  axisGrey: '#a9acbd',
  tickTextGrey: '#343434',
  axisLegend: colors.secondary,
};

const components = {
  baseStyles: {
    bold: {
      fontWeight: 500,
    },
  },
  boxStyles: {
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  flexStyles: {
    row: {
      flexDirection: 'row',
    },
    column: {
      flexDirection: 'column',
    },
  },
  linkStyles: {
    primary: {
      color: colors.primary,
    },
    bare: {
      textDecoration: 'none',
    },
  },
};

export default {
  chartColors,
  ...colors,
  ...components,
  variables: {
    colors: colors,
  },
};
