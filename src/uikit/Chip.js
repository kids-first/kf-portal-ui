import * as React from 'react';
import PropTypes from 'prop-types';

import Column from './Column';

import './Chip.css';

const Chip = ({ style = {}, children }) => (
  <Column className="chip-container">
    <div className="chip-content" style={style}>
      {children}
    </div>
  </Column>
);

Chip.propTypes = {
  style: PropTypes.object,
};

export default Chip;
