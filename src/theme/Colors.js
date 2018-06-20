const colors = {
  white: '#ffffff',
  primary: '#90278e', //magenta
  secondary: '#2b388f', //purplish blue
  tertiary: '#009bb8', //teal-blue

  highlight: '#e83a9c', //pink

  active: '#00afed', //light blue
  inactive: '#dedfe4', //grey

  optionSelected: '#E5F6FD', //light blue
  //TODO: make all grayscale colors the same color space either all rgb or all hex
  grey: [
    'rgb(237,238,241)', //grey for table backgrounds
    '#74757d', //rgb(116, 117, 125) dark grey text on greyScale5
    '#d4d6dd',
    'rgb(107,98,98)',
    'rgb(245,245,245)',
    '#e0e1e6',
    'rgb(212, 214, 221)', //#d4d6dd
    'rgb(144,144,144)', //not enough contrast on white background
    'rgb(61,61,61)',
    'rgb(52, 52, 52)', //#343434
    'rgb(36,36,36)',
  ],

  hover: {
    main: '#c03299', //also pink
    primary: '#404c9a', //purple
    tertiary: '#19a9c4', //lighter teal-blue
  },
  background: {
    grey: '#f4f5f8',
    error: '#f9dee1',
    tertiary: '#edeef1', // light light blue
  },
  border: {
    grey: '#cacbcf',
    error: `#e45562`,
  },
  error: {
    dark: '#d8202f', //red
    light: '#fadfe1', //light red (pink) fill
  },
};

export const gradients = {
  primary: `${colors.primary}, #cc3399 35%, #be1e2d 66%, #f6921e`,
  blue: `linear-gradient(to right, ${colors.hover.primary}, ${
    colors.tertiary
  } 51%, #02b0ed), linear-gradient(${colors.secondary}, ${colors.secondary})`,
};

export const shadows = ['0 0 4.8px 0.2px #a0a0a3', '0 0 2.9px 0.1px #a0a0a3', 'rgba(0, 0, 0, 0.5)'];

export default colors;
