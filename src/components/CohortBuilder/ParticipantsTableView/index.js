import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';

import { withApi } from 'services/api';
import { participantsQuery } from './queries';

import QueriesResolver from '../QueriesResolver';
import ParticipantsTable from './ParticipantsTable';
import TableErrorView from './TableErrorView';

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
  onRemoveFromCohort,
  api,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  selectedRows,
  setSelectedRows,
  allRowsSelected,
  setAllRowsSelected,
}) => {
  return (
    <QueriesResolver
      name="GQL_PARTICIPANTS_TABLE"
      api={api}
      queries={[participantsQuery(sqon, pageSize, pageIndex)]}
    >
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
          <ParticipantsTable
            loading={isLoading}
            data={dataWithRowSelection}
            dataTotalCount={data[0] ? data[0].total : 0}
            downloadName={'participant-table'}
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
            onClearSelected={() => {
              setAllRowsSelected(s => false);
              setSelectedRows(s => []);
            }}
            onRemoveFromCohort={() => {
              // remove the selected participants from the cohort
              onRemoveFromCohort(selectedRows);
              // clear selection
              setAllRowsSelected(s => false);
              setSelectedRows(s => []);
            }}
            selectedRows={selectedRows}
            allRowsSelected={allRowsSelected}
          />
        );
      }}
    </QueriesResolver>
  );
};

ParticipantsTableView.propTypes = {
  sqon: PropTypes.object.isRequired,
  onRemoveFromCohort: PropTypes.func.isRequired,
};

export default enhance(ParticipantsTableView);
