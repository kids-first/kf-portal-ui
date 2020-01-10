import React from 'react';
import PropTypes from 'prop-types';

import Column from 'uikit/Column';

import '../InfoBox.css';

const InfoBox = ({ value, description }) => (
  <Column className="info-box">
    <div className="info-box-value">
      {typeof value === 'number' ? value.toLocaleString() : '--'}
    </div>
    <div className="info-box-description">{description}</div>
  </Column>
);

InfoBox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string.isRequired,
};

export default InfoBox;
