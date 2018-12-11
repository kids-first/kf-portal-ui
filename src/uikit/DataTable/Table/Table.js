import React from 'react';
import ReactTable from 'react-table';
import { withTheme } from 'emotion-theming';

import StyleWrapper from './StyleWrapper';

const Table = withTheme(
  ({ loading, data, columns, onPageChange, onPageSizeChange, styles, striped = false }) => (
    <StyleWrapper styles={styles}>
      <ReactTable
        loading={loading}
        data={data}
        columns={columns}
        showPagination={data.length > 10}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        sortable={false}
        multiSort={false}
        resizable={false}
        className={true ? '-striped' : ''}
        minRows={1}
      />
    </StyleWrapper>
  ),
);

export default Table;
