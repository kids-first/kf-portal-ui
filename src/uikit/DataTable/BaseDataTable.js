import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';

import Table from './Table';
import TableToolbar from './TableToolbar';

const enhance = compose(
  withState('pageSize', 'setPageSize', 10),
  withState('pageIndex', 'setPageIndex', 0),
);

const BaseDataTable = ({
  loading,
  data,
  columns,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
  header = true,
}) => (
  <Fragment>
    {header ? (
      <TableToolbar pageSize={pageSize} page={pageIndex} total={data.length}>
        <div>filter</div>
        <div>export</div>
      </TableToolbar>
    ) : null}
    <Table
      loading={loading}
      data={data}
      columns={columns}
      onPageChange={pageIndex => setPageIndex(pageIndex)}
      onPageSizeChange={(pageSize, pageIndex) => setPageSize(pageSize)}
    />
  </Fragment>
);

export default enhance(BaseDataTable);
