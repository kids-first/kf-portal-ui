import React from 'react';
import CheckmarkIcon from 'icons/CheckmarkIcon';
import RightIcon from 'react-icons/lib/fa/angle-right';
import Row from 'uikit/Row';

const CategoryRow = ({ active, title }) => (
  <Row
    style={{
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: '282px',
    }}
  >
    <Row>
      {active ? <CheckmarkIcon style={{ marginRight: '5px' }} /> : null}
      {title}
    </Row>
    <RightIcon />
  </Row>
);

export default CategoryRow;
