import React from 'react';

import { css } from 'emotion';

import styled from 'react-emotion';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Row from 'uikit/Row';

export const styles = css`
  table {
    border-collapse: collapse;
  }
  span.title {
    font-weight: bold;
    padding: 15px;
  }
`;

export const ItemRowContainer = styled(Row)`
  padding-top: 5px;
  padding-bottom: 5px;
  min-height: 50px;
  padding-right: 10%;
  &:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.borderGrey};
  }
`;

export const Spinner = () => (
  <Row justifyContent={'center'}>
    <LoadingSpinner width={20} height={20} />
  </Row>
);
