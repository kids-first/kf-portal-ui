import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';

import Table from './Table';
import TableToolbar from './TableToolbar';
import ColumnFilter from './ToolbarButtons/ColumnFilter';
import Export from './ToolbarButtons/Export';

import { configureCols } from './utils/columns';

const enhance = compose(
  withState('pageSize', 'setPageSize', 10),
  withState('pageIndex', 'setPageIndex', 0),
  withState('columns', 'setColumns', props => configureCols(props.columns)),
);

const BaseDataTable = ({
  loading,
  data,
  columns,
  setColumns,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
  header = true,
}) => (
  <Fragment>
    {header ? (
      <TableToolbar pageSize={pageSize} page={pageIndex} total={data.length}>
        <ColumnFilter
          columns={columns}
          onChange={item => {
            const index = columns.findIndex(c => c.index === item.index);
            setColumns(
              columns.map((col, i) => (i === index ? { ...col, ...{ show: !item.show } } : col)),
            );
          }}
        />

        <Export {...{ columns, data }}>export</Export>
      </TableToolbar>
    ) : null}
    <Table
      columns={columns}
      loading={loading}
      data={data}
      onPageChange={pageIndex => setPageIndex(pageIndex)}
      onPageSizeChange={(pageSize, pageIndex) => setPageSize(pageSize)}
    />
  </Fragment>
);

BaseDataTable.propTypes = {};

export default enhance(BaseDataTable);
