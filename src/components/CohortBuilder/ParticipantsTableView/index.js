import React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';

import { withApi } from 'services/api';
import { participantsQuery } from './queries';

import QueriesResolver from '../QueriesResolver';
import ParticipantsTable from './ParticipantsTable';
import TableErrorView from './TableErrorView';

import EmptyCohortOverlay from './../EmptyCohortOverlay';

const enhance = compose(
  withApi,
  withTheme,
  withState('pageSize', 'setPageSize', 10),
  withState('pageIndex', 'setPageIndex', 0),
  withState('selectedRows', 'setSelectedRows', []),
  withState('allRowsSelected', 'setAllRowsSelected', false),
);

const ParticipantsTableView = ({
  sqon,
  api,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  selectedRows,
  setSelectedRows,
  allRowsSelected,
  setAllRowsSelected,
}) => {
  return (
    <QueriesResolver api={api} sqon={sqon} queries={[participantsQuery(sqon, pageSize, pageIndex)]}>
      {({ isLoading, data, error }) => {
        if (error) {
          return <TableErrorView error={error} />;
        }

        const isRowSelected = node =>
          allRowsSelected || selectedRows.some(row => row === node.participantId);

        const dataWithRowSelection = data[0]
          ? data[0].nodes.map(node => ({ ...node, selected: isRowSelected(node) }))
          : [];

        return (
          <React.Fragment>
            {!sqon ? <EmptyCohortOverlay /> : null}
            {
              <ParticipantsTable
                loading={isLoading}
                data={dataWithRowSelection}
                dataTotalCount={data[0] ? data[0].total : 0}
                onFetchData={({ page, pageSize }) => {
                  setPageIndex(page);
                  setPageSize(pageSize);
                }}
                onRowSelected={(checked, row) => {
                  const rowId = row.participantId;
                  if (checked) {
                    setSelectedRows(s => s.concat(rowId));
                    return;
                  }
                  setSelectedRows(s => s.filter(row => row !== rowId));
                }}
                onAllRowsSelected={checked => {
                  // don't keep individual rows selected when "select all" is checked
                  //  to avoid having them selected after "unselect all"
                  setAllRowsSelected(s => checked);
                  setSelectedRows(s => []);
                }}
              />
            }
          </React.Fragment>
        );
      }}
    </QueriesResolver>
  );
};

export default enhance(ParticipantsTableView);
