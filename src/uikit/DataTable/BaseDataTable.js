import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';

import Table from './Table';
import TableToolbar from './TableToolbar';
import ColumnFilter from './ToolbarButtons/ColumnFilter';

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
  config,
}) => (
  <Fragment>
    {header ? (
      <TableToolbar pageSize={pageSize} page={pageIndex} total={data.length}>
        <ColumnFilter onChange={x => x} columns={config.columns}>
          Columns
        </ColumnFilter>
        <div>export</div>
      </TableToolbar>
    ) : null}
    <Table
      config={config}
      loading={loading}
      data={data}
      onPageChange={pageIndex => setPageIndex(pageIndex)}
      onPageSizeChange={(pageSize, pageIndex) => setPageSize(pageSize)}
    />
  </Fragment>
);

BaseDataTable.propTypes = {};

export default enhance(BaseDataTable);
