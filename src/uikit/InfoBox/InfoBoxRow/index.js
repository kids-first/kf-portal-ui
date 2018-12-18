import React from 'react';
import InfoBox from '../InfoBox';
import Row from 'uikit/Row';

const InfoBoxRow = ({ data }) => (
  <Row>
    {data.map(d => (
      <InfoBox value={d.value} description={d.description} />
    ))}
  </Row>
);
export default InfoBoxRow;
