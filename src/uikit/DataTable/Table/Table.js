import React from 'react';
import ReactTable from 'react-table';

import StyleWrapper from './StyleWrapper';

const Table = ({ data, columns }) => (
  <StyleWrapper>
    <ReactTable data={data} columns={columns} />
  </StyleWrapper>
);

export default Table;
