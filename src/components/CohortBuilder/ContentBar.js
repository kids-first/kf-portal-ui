import React from 'react';
import Row from 'uikit/Row';

import './CohortBuilder.css';

const ContentBar = ({ children, className }) => (
  <Row className={`cb-contentBar ${className}`}>{children}</Row>
);

export default ContentBar;
