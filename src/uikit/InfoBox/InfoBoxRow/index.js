import React from 'react';

import { Flex } from 'uikit/Core';
import { mq } from 'uikit/BreakpointHelper';

import InfoBox from '../InfoBox';
import '../InfoBox.css';

const InfoBoxRow = ({ data }) => (
  <Flex className={`info-box-row ${mq[1] ? 'medium' : ''}`}>
    {data.map((d, i) => (
      <InfoBox key={i} value={d.value} description={d.description} />
    ))}
  </Flex>
);

export default InfoBoxRow;
