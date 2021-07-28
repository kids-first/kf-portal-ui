import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import useQueryResolver from 'hooks/useQueryResolver';
import { withApi } from 'services/api';
import { setSelectionSqons } from 'store/actionCreators/virtualStudies';
import { Sqon } from 'store/sqon';
import { LoggedInUser } from 'store/userTypes';

import ParticipantsTable from './ParticipantsTable';
import { participantsQuery, SORTABLE_FIELDS_MAPPING } from './queries';
import TableErrorView from './TableErrorView';

import './index.scss';

type OwnProps = {
  sqon: Sqon;
  loggedInUser?: LoggedInUser;
  api: Function;
};

type Participant = {
  ageAtDiagnosis: Array<number>;
  diagnosis: Array<string>;
  diagnosisCategories: Array<string>;
  diagnosisMondo: Array<string>;
  familyCompositions: Array<string>;
  familyId: string;
  filesCount: number;
  gender: string;
  isProband: string;
  participantId: string;
  studyCode: string;
  studyId: string;
  studyName: string;
  vitalStatus: string;
  selected?: boolean;
};

const ParticipantsTableView = (props: OwnProps) => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allRowsSelected, setAllRowsSelected] = useState(false);
  const [sort, setSort] = useState([]);
  const { isLoading, data, error, updateQueries } = useQueryResolver(
    props.api,
    'GQL_PARTICIPANTS_TABLE',
  );

  useEffect(() => {
    if (selectedRows.length) {
      const selectionSQON = {
        op: 'and',
        content: [{ op: 'in', content: { field: 'kf_id', value: selectedRows } }],
      };
      dispatch(setSelectionSqons(selectionSQON));
    } else {
      dispatch(setSelectionSqons(null));
    }
  }, [dispatch, selectedRows]);

  useEffect(() => {
    updateQueries([participantsQuery(props.sqon, sort, pageSize, pageIndex)]);
  }, [sort, pageSize, pageIndex, props.sqon]);

  if (error) {
    return (
      <div className="ptv-error-message">
        <TableErrorView error={error} />
      </div>
    );
  }

  const isRowSelected = (node: Participant) =>
    allRowsSelected || selectedRows.some((row) => row === node.participantId);

  const dataWithRowSelection =
    data[0]?.nodes?.map((node: Participant) => ({
      ...node,
      selected: isRowSelected(node),
    })) || [];

  return (
    <ParticipantsTable
      sqon={props.sqon}
      loading={isLoading}
      data={dataWithRowSelection}
      api={props.api}
      sort={sort}
      dataTotalCount={data[0]?.total || 0}
      downloadName={'participant-table'}
      onFetchData={({
        page,
        pageSize,
        sorted,
      }: {
        page: number;
        pageSize: number;
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
      onRowSelected={(checked: boolean, row: any) => {
        const rowId = row.participantId;
        if (checked) {
          setSelectedRows((s) => s.concat(rowId));
          return;
        }
        setSelectedRows((s) => s.filter((row) => row !== rowId));
      }}
      onAllRowsSelected={(checked: boolean) => {
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
};

export default connect(null, { setSelectionSqons })(withApi(ParticipantsTableView));
