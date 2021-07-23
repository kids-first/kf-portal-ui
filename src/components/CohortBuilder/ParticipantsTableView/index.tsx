import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { withApi } from 'services/api';
import { setSelectionSqons } from 'store/actionCreators/virtualStudies';

import QueriesResolver from '../QueriesResolver';

import ParticipantsTable from './ParticipantsTable';
import { participantsQuery, SORTABLE_FIELDS_MAPPING } from './queries';
import TableErrorView from './TableErrorView';

import './index.scss';

type ParticipantsTableViewProps = {
  sqon: object;
  loggedInUser?: object;
  api: any;
};

const ParticipantsTableView: React.FC<ParticipantsTableViewProps> = (props) => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allRowsSelected, setAllRowsSelected] = useState(false);
  const [sort, setSort] = useState([]);

  useEffect(() => {
    if (selectedRows.length) {
      let selectionSQON = {
        op: 'and',
        content: [{ op: 'in', content: { field: 'kf_id', value: selectedRows } }],
      };
      dispatch(setSelectionSqons(selectionSQON));
    } else {
      dispatch(setSelectionSqons(null));
    }
  }, [selectedRows]);

  return (
    <QueriesResolver
      name="GQL_PARTICIPANTS_TABLE"
      api={props.api}
      queries={[participantsQuery(props.sqon, sort, pageSize, pageIndex)]}
    >
      {({ isLoading, data, error }: { isLoading: Boolean; data: any; error: any }) => {
        if (error) {
          return (
            <div className="ptv-error-message">
              <TableErrorView error={error} />
            </div>
          );
        }

        const isRowSelected = (node: any) =>
          allRowsSelected || selectedRows.some((row) => row === node.participantId);

        const dataWithRowSelection = data[0]
          ? data[0].nodes.map((node: any) => ({ ...node, selected: isRowSelected(node) }))
          : [];

        return (
          <ParticipantsTable
            sqon={props.sqon}
            loading={isLoading}
            data={dataWithRowSelection}
            api={props.api}
            sort={sort}
            dataTotalCount={data[0] ? data[0].total : 0}
            downloadName={'participant-table'}
            onFetchData={({
              page,
              pageSize,
              sorted,
            }: {
              page: any;
              pageSize: any;
              sorted: any;
            }) => {
              const sorting = sorted
                .filter((s: any) => SORTABLE_FIELDS_MAPPING.has(s.id))
                .map((s: any) => ({
                  field: SORTABLE_FIELDS_MAPPING.get(s.id),
                  order: s.desc ? 'desc' : 'asc',
                }));
              setPageIndex(page);
              setPageSize(pageSize);
              setSort(sorting);
            }}
            onRowSelected={(checked: any, row: any) => {
              const rowId = row.participantId;
              if (checked) {
                setSelectedRows((s) => s.concat(rowId));
                return;
              }
              setSelectedRows((s) => s.filter((row) => row !== rowId));
            }}
            onAllRowsSelected={(checked: any) => {
              // don't keep individual rows selected when "select all" is checked
              //  to avoid having them selected after "unselect all"
              setAllRowsSelected(() => checked);
              setSelectedRows(() => []);
            }}
            onClearSelected={() => {
              setAllRowsSelected(() => false);
              setSelectedRows(() => []);
            }}
            selectedRows={selectedRows}
            allRowsSelected={allRowsSelected}
            loggedInUser={props.loggedInUser}
          />
        );
      }}
    </QueriesResolver>
  );
};

export default connect(null, { setSelectionSqons })(withApi(ParticipantsTableView));
