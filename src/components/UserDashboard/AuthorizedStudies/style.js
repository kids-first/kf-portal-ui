import React from 'react';
import styled from 'react-emotion';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Column from 'uikit/Column';

export const StudyCol = styled(Column)`
  font-family: ${({ theme }) => theme.fonts.details}
  padding-top: 5px;
  padding-bottom: 5px;
  &:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.borderGrey};
  }
`;

export const Spinner = () => (
  <Row justifyContent={'center'}>
    <LoadingSpinner width={20} height={20} />
  </Row>
);
