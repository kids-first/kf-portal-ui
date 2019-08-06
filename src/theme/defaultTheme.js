const css = require('react-emotion').css;

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

  //primaryGradient: `#90278e, #cc3399 35%, #be1e2d 66%, #f6921e`,

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
  defaultChip: '#404c9a',

  // table
  backgroundRowOdd: '#fff',
  backgroundRowEven: '#f4f5f8',
};

const chartColors = {
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

const fonts = {
  default: 'Montserrat, sans-serif',
  details: 'Open Sans, sans-serif',
};

const mixins = {
  linkButtonActive: css`
    border-radius: 19px;
    background-color: ${colors.primaryHover};
    border: solid 2px ${colors.borderGrey};
    color: ${colors.white};
  `,

  contentContainer: css`
    width: 76%;
    max-width: 1400px;
  `,
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
  uppercase: css`
    text-transform: uppercase;
  `,
  linkAsButton: css`
    font-size: 12px;
    line-height: 2.17;
    letter-spacing: 0.2px;
    text-align: left;
    color: #ffffff;
    display: block;
    padding: 6px 16px;
    margin: 0px 4px;
    text-decoration: none;
    border: solid 2px transparent;
    background-color: ${colors.primary};
    color: #fff;
    letter-spacing: 0.2px;
    border-radius: 19px;
    border: solid 2px transparent;

    &:hover {
      ${mixins.linkButtonActive};
    }
  `,
  button: css`
    outline: none;
    border: 0;
    background: none;
    box-shadow: none;
    background-color: ${colors.primary};
    color: #fff;
    padding: 6px 16px;
    font-size: 14px;
    line-height: 1.86;
    letter-spacing: 0.2px;
    margin: 0px 4px;
    border-radius: 19px;
    border: solid 2px transparent;
    cursor: pointer;

    a:hover,
    &:hover {
      background-color: ${colors.primaryHover};
      border: solid 2px #dcdde3;
      color: #ffffff;
      cursor: pointer;
    }

    a,
    &:link {
      color: #ffffff !important;
      text-decoration: none;
    }
  `,
  hollowButton: css`
    outline: none;
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0px;
    padding: 5px 10px;
    margin: 0px 4px;
    border-radius: 12px;
    background-color: ${colors.white};
    border: solid 1px ${colors.borderGrey};
    font-size: 12px;
    letter-spacing: 0.2px;
    text-align: center;
    color: ${colors.tertiary};
    font-weight: normal;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-transform: uppercase;
    font-family: ${fonts.default};

    &:hover {
      background-color: ${colors.tertiary};
      color: ${colors.white};
    }
    &:link {
      text-decoration: none;
    }
    &:disabled {
      color: ${colors.greyScale7};
    }
    &:disabled:hover {
      background-color: transparent;
      color: ${colors.greyScale7};
      cursor: default;
    }
    & .icon {
      margin-right: 5px;
    }
  `,
  actionButton: css`
    outline: none;
    border: 0;
    background: none;
    box-shadow: none;
    color: #fff;
    padding: 0px 16px;
    line-height: 1.86;
    letter-spacing: 0.2px;
    border-radius: 19px;
    background-color: ${colors.tertiary};
    white-space: nowrap;
    text-transform: uppercase;

    &:hover {
      background-color: ${colors.tertiaryHover};
      color: #ffffff;
      cursor: pointer;
    }
    &:link {
      text-decoration: none;
    }
    &:disabled,
    &:disabled:hover {
      cursor: default;
      color: ${colors.greyScale7};
      background-color: ${colors.greyScale4};
    }
  `,
  wizardButton: css`
    cursor: pointer;
    outline: none;
    border: 0;
    background: none;
    box-shadow: none;
    background-color: '#fff';
    color: ${colors.tertiary};
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.86;
    letter-spacing: 0.2px;
    margin: 0px 4px;
    border-radius: 19px;
    border: solid 2px transparent;

    &:hover {
      background-color: ${colors.tertiary};
      color: #ffffff;
    }
    &:link {
      text-decoration: none;
    }
    &:disabled {
      color: ${colors.greyScale7};
    }
    &:disabled:hover {
      cursor: default;
      background-color: transparent;
      color: ${colors.greyScale7};
    }
  `,
  card: css`
    border-radius: 10px;
    background-color: #ffffff;
    padding: 30px;
    box-shadow: 0 0 4.9px 0.1px #bbbbbb;
    border: solid 1px ${colors.greyScale5};
    color: ${colors.greyScale1};
  `,
  profileH3: css`
    font-size: 14px;
    font-weight: bold;
    line-height: 1.71;
    letter-spacing: 0.2px;
    color: #343434;
    margin: 0;
  `,
  profileH2: css`
    color: ${colors.secondary};
    margin-top: 0px;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.27;
    letter-spacing: 0.3px;
    border-bottom: 1px solid #d4d6dd;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 10px;
  `,
  modalTitle: css`
    color: ${colors.secondary};
    font-size: 20px;
    font-weight: 300;
    line-height: 1.3;
    letter-spacing: 0.3px;
    margin: 0px;
    margin-bottom: 0.8em;
    display: flex;
    justify-content: space-between;
  `,
  modalHeader: css`
    font-size: 15px;
    font-weight: 600;
    line-height: 1.87;
    letter-spacing: 0.2px;
    color: ${colors.greyScale1};
  `,
  h2: css`
    text-align: center;
    color: ${colors.secondary};
    font-size: 30px;
    line-height: 0.87;
    letter-spacing: 0.4px;
    color: #2b388f;
    font-weight: 500;
  `,
  h3: css`
    font-weight: 500;
    font-size: 18px;
    line-height: 1.44;
    letter-spacing: 0.3px;
    color: ${colors.secondary};
  `,
  h4: css`
    font-family: ${fonts.details};
    color: #fff;
    font-size: 30px;
    line-height: 31px;
    margin: 10px 0;
  `,
  input: css`
    width: 100%;
    min-width: 0;
    padding: 6px 12px;
    font-family: Open Sans,sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
    background-color: #fff;
    border: 1px solid ${colors.greyScale4};
    border-radius: 10px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    
    &:disabled {
        background-color: #edeef1;
        color: #8f9196;
    }
  },
  `,
  /// TextArea inherits from Input
  // font-family has to be redefined to avoid the user agent style from overriding it.
  textarea: css`
    font-family: Open Sans, sans-serif;
  `,
  column: css`
    display: flex;
    flex-direction: column;
  `,
  row: css`
    display: flex;
    flex-direction: row;
  `,
  center: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  fillCenter: css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  navLink: css`
    display: block;
    color: ${colors.hover};
    padding: 6px 10px;
    margin: 0px 4px;
    text-decoration: none;
    border: solid 2px transparent;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      ${mixins.linkButtonActive};
    }
  `,
  navBar: css`
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    line-height: 1.86;
    letter-spacing: 0.2px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.86;
    letter-spacing: 0.2px;
    text-align: left;
    color: #90278e;
  `,
  externalLink: css`
    color: ${colors.primary};
    cursor: pointer;
    &:hover,
    &.active {
      color: ${colors.highlight};
    }
  `,
  secondaryNav: css`
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 1.86;
    letter-spacing: 0.2px;
    border-left: 1px solid ${colors.greyScale5};

    li {
      height: 100%;
      display: flex;
      box-sizing: content-box;
      border-right: 1px solid ${colors.greyScale5};
      a {
        height: 100%;
        display: block;
        font-size: 16px;
        line-height: 1.86;
        letter-spacing: 0.2px;
        text-align: left;
        color: ${colors.primary};
        font-weight: 500;
        padding: 10px 40px;
        text-decoration: none;
      }

      a:hover,
      a.active {
        cursor: pointer;
        color: ${colors.highlight};
        font-weight: 500;
        border-bottom: 5px solid ${colors.highlight};
        text-decoration: none;
      }
    }
  `,
  select: css`
    width: 200px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    border: 1px solid ${colors.greyScale4};
    border-radius: 10px;
    box-shadow: none;
    background: transparent;
    -webkit-appearance: none;
    background-position: right 50%;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDZFNDEwNjlGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDZFNDEwNkFGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NkU0MTA2N0Y3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NkU0MTA2OEY3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuGsgwQAAAA5SURBVHjaYvz//z8DOYCJgUxAf42MQIzTk0D/M+KzkRGPoQSdykiKJrBGpOhgJFYTWNEIiEeAAAMAzNENEOH+do8AAAAASUVORK5CYII=);
    padding: 0.5em;
    padding-right: 1.5em;
    text-transform: capitalize;
    &:focus {
      outline: none;
    }
  `,
  hollowSelect: css`
    border-bottom: 1px solid ${colors.greyScale4};
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    -webkit-appearance: none;
    background-position: right 50%;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDZFNDEwNjlGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDZFNDEwNkFGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NkU0MTA2N0Y3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NkU0MTA2OEY3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuGsgwQAAAA5SURBVHjaYvz//z8DOYCJgUxAf42MQIzTk0D/M+KzkRGPoQSdykiKJrBGpOhgJFYTWNEIiEeAAAMAzNENEOH+do8AAAAASUVORK5CYII=);
    padding: 0.5em;
    padding-right: 1.5em;
    text-transform: capitalize;
    &:focus {
      outline: none;
    }
  `,
  dropdownContainer: css`
    position: absolute;
    top: 100%;
    backgroundcolor: white;
    border: 1px solid ${colors.greyScale4};
    width: 100%;
    font-size: 14px;
  `,
  //toasts
  success: css`
    font-family: ${fonts.details};
    font-size: 13px;
    font-weight: 600;
    line-height: 1.85;
    text-align: left;

    color: ${colors.greyScale1};
    border-radius: 5px;
    background-color: #d9eaed;
    box-shadow: 0 0 5.8px 0.2px #9b9b9d;
    border: solid 2px ${colors.tertiary};
    width: 469px;

    a {
      color: ${colors.primary};
      text-decoration: underline;
    }
    a:hover {
      color: ${colors.hover};
      text-decoration: underline;
    }
  `,
  //no styles for these yet
  error: css``,
  warning: css``,
  info: css``,
};

module.exports = {
  chartColors,
  ...colors,
  ...components,
  ...mixins,
  fonts,
  variables: {
    colors: colors,
  },
};
