import React, { Fragment } from 'react';

import Table from './Table';
import TableToolbar from './TableToolbar';

const BaseDataTable = ({ header = true, data, columns }) => (
  <Fragment>
    {header ? (
      <TableToolbar>
        <div>filter</div>
        <div>export</div>
      </TableToolbar>
    ) : null}
    <Table data={data} columns={columns} />
  </Fragment>
);

export default BaseDataTable;
