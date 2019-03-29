import * as React from 'react';
import { ActionsColumn, FileIdColumn } from './CustomColumns';
import DownloadIcon from 'icons/DownloadIcon';

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
      Header: () => <DownloadIcon width={13} fill={theme.filterPurple} />,
      Cell: props => <ActionsColumn {...props} fenceStudies={fenceStudies} />,
      width: 40,
      sortable: false,
      resizable: false,
    },
  },
];
