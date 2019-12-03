import React from 'react';
import ReactTable from 'react-table';

import CustomPagination from '../Pagination';

import './Table.css';

const Table = ({
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
  <div className="dataTable" styles={styles}>
    <ReactTable
      showPagination={showPagination}
      loading={loading}
      data={data}
      columns={columns}
      // showPagination={data.length > 10}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      sortable={false}
      multiSort={false}
      //resizable={false}
      className={`${className} ${striped ? '-striped' : ''}`}
      minRows={1}
      PaginationComponent={props => <CustomPagination {...props} />}
    />
  </div>
);

export default Table;
