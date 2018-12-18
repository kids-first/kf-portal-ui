import React from 'react';
import { css } from 'react-emotion';
import InfoBox from '../InfoBox';
import Row from 'uikit/Row';

const collapseBorder = props => css`
  border-right: none;
`;

const InfoBoxRow = ({ data }) => (
  <Row>
    {data.map((d, i) => (
      <InfoBox
        key={i}
        value={d.value}
        description={d.description}
        styles={i === data.length - 1 ? null : collapseBorder}
      />
    ))}
  </Row>
);

export default InfoBoxRow;
