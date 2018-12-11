import React, { Fragment } from 'react';

import Table from './Table';
import TableToolbar from './TableToolbar';

const BaseDataTable = ({ loading, data, columns, header = true }) => (
  <Fragment>
    {header ? (
      <TableToolbar>
        <div>filter</div>
        <div>export</div>
      </TableToolbar>
    ) : null}
    <Table loading={loading} data={data} columns={columns} />
  </Fragment>
);

export default BaseDataTable;
