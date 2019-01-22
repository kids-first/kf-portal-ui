import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsivePie } from '@nivo/pie';

class Pie extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ResponsivePie height={100}/>
    );
  }
}

Pie.propTypes = {
};

export default Pie;