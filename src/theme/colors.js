const colors = {
  white: '#ffffff',
  black: '#000000',
  primary: '#90278e', //magenta
  secondary: '#2b388f', //purplish blue
  primaryHover: '#404c9a', //purple
  tertiary: '#009bb8', //teal-blue
  highlight: '#e83a9c', //pink
  hover: '#c03299', //also pink
  tertiaryHover: '#19a9c4', //lighter teal-blue
  errorDark: '#d8202f', //red
  errorLight: '#fadfe1', //light red (pink) fill
  borderGrey: '#cacbcf',
  backgroundGrey: '#f4f5f8',
  errorBackground: '#f9dee1',
  errorBorder: `#e45562`,

  active: '#00afed', //light blue
  inactive: '#dedfe4', //grey

  optionSelected: '#E5F6FD', //light blue

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
};

export const gradients = {
  blue: `linear-gradient(to right, ${colors.primaryHover}, ${
    colors.tertiary
  } 51%, #02b0ed), linear-gradient(${colors.secondary}, ${colors.secondary})`,
};

export const shadows = ['0 0 4.8px 0.2px #a0a0a3', '0 0 2.9px 0.1px #a0a0a3'];

export default colors;
