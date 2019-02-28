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
}) => {
  return (
    <QueriesResolver api={api} sqon={sqon} queries={[participantsQuery(sqon, pageSize, pageIndex)]}>
      {({ isLoading, data, error }) => {
        if (error) {
          return <TableErrorView error={error} />;
        }

        const isRowSelected = node => selectedRows.some(row => row === node.participantId);

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
                onRowSelected={(row, checked) => {
                  const rowId = row.participantId;
                  if (checked) {
                    setSelectedRows(s => s.concat(rowId));
                    return;
                  }
                  setSelectedRows(s => s.filter(row => row !== rowId));
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
