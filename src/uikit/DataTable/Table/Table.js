import React from 'react';
import ReactTable from 'react-table';
import { withTheme } from 'emotion-theming';

import StyleWrapper from './StyleWrapper';
import CustomPagination from '../Pagination';

const Table = withTheme(
  ({
    showPagination,
    loading,
    data,
    columns,
    onPageChange,
    onPageSizeChange,
    styles,
    striped = true,
    className = '',
  }) => (
    <StyleWrapper styles={styles}>
      <ReactTable
        showPagination={showPagination}
        loading={loading}
        data={data}
        columns={columns}
        showPagination={data.length > 10}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        sortable={false}
        multiSort={false}
        //resizable={false}
        className={`${className} ${striped ? '-striped' : ''}`}
        minRows={1}
        PaginationComponent={props => <CustomPagination {...props} />}
      />
    </StyleWrapper>
  ),
);

export default Table;
