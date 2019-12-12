import * as React from 'react';
import PropTypes from 'prop-types';

import Column from 'uikit/Column';

import './EntityPage.css';

const EntityContentSection = ({ title, children, size }) => (
  <Column className="entityContentSection-container">
    <h2 className={`entityContentSection-title ${size}`}>{title}</h2>
    <div className="entityContentSection-content">{children}</div>
  </Column>
);

EntityContentSection.propTypes = {
  title: PropTypes.string.isRequired,
};

export default EntityContentSection;
