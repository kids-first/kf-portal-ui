import * as React from 'react';
import { ActionsColumn, FileIdColumn, ParticipantIdColumn } from './CustomColumns';
import theme from 'theme/defaultTheme';
import DbGapExternalIdColumn from './CustomColumns/DbGapExternalIdColumn';

const CustomFileIdColumn = (props) => <FileIdColumn {...props} />;
const CustomParticipantIdColumn = (props) => <ParticipantIdColumn {...props} />;
const CustomDbGapExternalIdColumn = (props) => <DbGapExternalIdColumn {...props} />;
const CustomActionsColumn = (fenceAcls) => (props) => (
  <ActionsColumn {...props} fenceAcls={fenceAcls} />
);
const Header = (header) => <span style={{ color: theme.filterPurple }}>{header}</span>;

export default ({ fenceAcls }) => [
  {
    index: 0,
    content: {
      accessor: 'kf_id',
      Cell: CustomFileIdColumn,
      field: 'kf_id',
    },
  },
  {
    index: 1,
    content: {
      accessor: 'participants.hits.edges[0].node.kf_id',
      Cell: CustomParticipantIdColumn,
      field: 'participants.kf_id',
    },
  },
  {
    index: 2,
    content: {
      accessor: 'participants.hits.edges[0].node.study.external_id',
      Header: Header('dbGap'),
      Cell: CustomDbGapExternalIdColumn,
      width: 120,
    },
  },
  {
    //dummy column - not shown in table (data_access_authority fetch required)
    content: {
      accessor: 'participants.hits.edges[0].node.study.data_access_authority',
      show: false,
      canChangeShow: true,
      fetch: true,
    },
  },
  {
    index: 13,
    content: {
      accessor: 'kf_id',
      Header: Header('Actions'),
      Cell: CustomActionsColumn(fenceAcls),
      width: 80,
      sortable: false,
      resizable: false,
    },
  },
];
