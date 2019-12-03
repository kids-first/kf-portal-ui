import React from 'react';

import Row from 'uikit/Row';

import './ViewLink.css';

const ViewLink = ({ children, Icon, onClick, active }) => (
  <Row className={`viewLink ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon className="viewLinkIcon" />
    {children}
  </Row>
);

export default ViewLink;
