import React from 'react';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import LoadingSpinner from 'uikit/LoadingSpinner';
import Column from 'uikit/Column';

export const Spinner = () => (
  <Row justifyContent={'center'}>
    <LoadingSpinner width={20} height={20} />
  </Row>
);
