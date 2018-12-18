import React from 'react';

import Column from 'uikit/Column';

const InfoBox = ({ value, description }) => (
  <Column alignItems="center" justifyContent="center">
    <div>{value}</div>
    <div>{description}</div>
  </Column>
);

export default InfoBox;
