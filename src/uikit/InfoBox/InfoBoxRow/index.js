import React from 'react';
import styled, { css } from 'react-emotion';
import InfoBox from '../InfoBox';
import { Flex } from 'uikit/Core';
import { mq } from '../styles';

const infoResp = css({
  flexDirection: 'column',

  [mq[1]]: {
    flexDirection: 'row',
  },
});

const InfoRow = styled(Flex)`
  ${infoResp}
`;

const InfoBoxRow = ({ data }) => (
  <InfoRow>
    {data.map((d, i) => (
      <InfoBox key={i} value={d.value} description={d.description} />
    ))}
  </InfoRow>
);

export default InfoBoxRow;
