import React from 'react';
import styled from 'react-emotion';
import InfoBox from '../InfoBox';
import { Flex } from 'uikit/Core';
import { mq } from 'uikit/BreakpointHelper';

const InfoRow = styled(Flex)`
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.greyScale5};
  & > div:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
  }
  margin-bottom: 20px;

  ${mq[1]} {
    flex-direction: row;
    margin-bottom: 0;
    border-bottom: 1px solid ${({ theme }) => theme.greyScale5};

    > div:last-child {
      border-bottom: none;
    }
  }
`;

const InfoBoxRow = ({ data }) => (
  <InfoRow>
    {data.map((d, i) => (
      <InfoBox key={i} value={d.value} description={d.description} />
    ))}
  </InfoRow>
);

export default InfoBoxRow;
