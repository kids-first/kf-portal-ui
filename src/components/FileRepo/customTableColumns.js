import * as React from 'react';
import { ActionsColumn, FileIdColumn } from './CustomColumns';

export default ({ theme, fenceAcls }) => [
  {
    index: 0,
    content: {
      accessor: 'kf_id',
      Cell: props => <FileIdColumn {...props} />,
      field: 'kf_id',
    },
  },
  {
    index: 13,
    content: {
      accessor: 'kf_id',
      Header: () => <span style={{ color: theme.filterPurple }}>Actions</span>,
      Cell: props => <ActionsColumn {...props} fenceAcls={fenceAcls} />,
      width: 80,
      sortable: false,
      resizable: false,
    },
  },
];
