import React from 'react';
import styled from 'react-emotion';
import CheckmarkIcon from 'icons/CheckmarkIcon';
import RightIcon from 'react-icons/lib/fa/angle-right';
import Row from 'uikit/Row';

const CRow = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const CategoryRow = ({ active, title }) => (
  <CRow>
    <Row>
      {active ? <CheckmarkIcon style={{ marginRight: '5px' }} /> : null}
      {title}
    </Row>
    <RightIcon />
  </CRow>
);

export default CategoryRow;
