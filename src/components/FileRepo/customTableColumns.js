import * as React from 'react';
import { ActionsColumn, FileIdColumn } from './CustomColumns';

export default ({ theme, fenceStudies }) => [
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
      Header: 'Actions',
      Cell: props => <ActionsColumn {...props} fenceStudies={fenceStudies} />,
      width: 80,
      sortable: false,
      resizable: false,
    },
  },
];
