import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsivePie } from '@nivo/pie';

class Pie extends Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {};
  }

  render() {
    return <ResponsivePie {...this.props} />;
  }
}

Pie.defaultProps = {
  margin: {
    right: 18,
    bottom: 16,
    left: 2,
  },
  enableRadialLabels: false,
  enableSlicesLabels: false,
  sliceLabel: 'id',
  slicesLabelsTextColor: 'inherit:darker(1.5)',
  sortByValue: true,
  innerRadius: 0,
  cornerRadius: 0,
  padAngle: 0,
  borderWidth: 1,
  borderColor: 'inherit:darker(0.5)',
  colorBy: 'id',
  isInteractive: true,
  colors: 'greys',
  onClick: x => x,
};

Pie.propTypes = {
  isInteractive: PropTypes.bool,
  colors: PropTypes.oneOf(['purples', 'blues', 'oranges', 'red_purple']),
  onClick: PropTypes.func,
};

export default Pie;

export const demographicPiesMock = {
  ethnicity: [
    {
      id: 'nhok',
      label: 'Not Hispanic or Latino',
      value: 20,
    },
    {
      id: 'notreported',
      label: 'Not Reported',
      value: 50,
    },
    {
      id: 'unknown',
      label: 'Reported Unknown',
      value: 100,
    },
    {
      id: 'hol',
      label: 'Hispanic or Latino',
      value: 25,
    },
  ],
  familyComposition: [
    {
      id: 'proband',
      label: 'Proband Only',
      value: 100,
    },
    {
      id: 'trio',
      label: 'Trio',
      value: 100,
    },
    {
      id: 'trioplus',
      label: 'Trio+',
      value: 100,
    },
    {
      id: 'duo',
      label: 'Duo',
      value: 100,
    },
    {
      id: 'duoplus',
      label: 'Duo+',
      value: 100,
    },
    {
      id: 'other',
      label: 'Other',
      value: 10,
    },
  ],
  gender: [
    {
      id: 'male',
      label: 'Male',
      value: 500,
    },
    {
      id: 'female',
      label: 'Female',
      value: 450,
    },
    {
      id: 'unknown',
      label: 'Reported Unknown',
      value: 50,
    },
    {
      id: 'unreported',
      label: 'Not Reported',
      value: 20,
    },
  ],
  race: [
    {
      id: 'white',
      label: 'White',
      value: 50,
    },
    {
      id: 'asian',
      label: 'Asian',
      value: 50,
    },
    {
      id: 'native',
      label: 'Native Hawaiian or Other Pacific Islander ',
      value: 50,
    },
    {
      id: 'other',
      label: 'Other',
      value: 20,
    },
    {
      id: 'unknown',
      label: 'Reported Unknown',
      value: 10,
    },
    {
      id: 'notreported',
      label: 'Not Reported',
      value: 5,
    },
    {
      id: 'nativeb',
      label: 'American Indian or Alaska Native ',
      value: 50,
    },
    {
      id: 'black',
      label: 'Black or African American',
      value: 50,
    },
    {
      id: 'morethanone',
      label: 'More Than One Race',
      value: 100,
    },
  ],
};
