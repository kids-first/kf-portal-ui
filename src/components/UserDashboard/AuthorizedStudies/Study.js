import React from 'react';
import styled from 'react-emotion';

import { StudyCol } from './style';
import Row from 'uikit/Row';
import ExternalLink from 'uikit/ExternalLink';
import ProgressBar from 'chartkit/components/ProgressBar';

const Name = styled('div')`
  color: #343434;
  font-size: 14px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.details};
  margin-bottom: 5px;
`;

const StudyCount = styled('div')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 13px;
  color: #74757d;
`;

const Codes = styled(StudyCount)`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 12px;
  font-weight: 600;
  color: #343434;
`;

const NumberLink = styled(ExternalLink)`
  text-decoration: underline;
`;

const Study = ({ name, codes, total, authorized }) => (
  <StudyCol>
    <Row justifyContent="space-between">
      <Name>{name}</Name>
      <StudyCount>
        Authorized: <NumberLink hasExternalIcon={false}>{authorized}</NumberLink>
        {' / '}
        <NumberLink hasExternalIcon={false}>{total}</NumberLink> files
      </StudyCount>
    </Row>
    <Codes>Consent Codes:</Codes> {}
    <ProgressBar numerator={authorized} denominator={total} />
  </StudyCol>
);

export default Study;
