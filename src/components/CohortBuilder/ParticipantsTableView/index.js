import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';

import { withApi } from 'services/api';
import { participantsQuery } from './queries';

import QueriesResolver from '../QueriesResolver';
import ParticipantsTable from './ParticipantsTable';
import TableErrorView from './TableErrorView';

import Card from 'uikit/Card';

import { SORTABLE_FIELDS_MAPPING } from './queries';

import { isObject } from 'lodash';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const {
  categories: {
    cohortBuilder: {
      results: {
        tableView,
      }
    },
  },
  actions,
} = TRACKING_EVENTS;

const trackTableViewAction = ({ category, subcategory, action, label }) => {
  trackUserInteraction({
    category: `${category}: ${subcategory}`,
    action,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label }),
  });
};

const enhance = compose(
  withApi,
  withTheme,
  withState('pageSize', 'setPageSize', 10),
  withState('pageIndex', 'setPageIndex', 0),
  withState('selectedRows', 'setSelectedRows', []),
  withState('allRowsSelected', 'setAllRowsSelected', false),
  withState('sort', 'setSort', []),
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
  sort,
  setSort,
}) => {
  return (
    <QueriesResolver
      name="GQL_PARTICIPANTS_TABLE"
      api={api}
      queries={[participantsQuery(sqon, sort, pageSize, pageIndex)]}
    >
      {({ data, error }) => {
        if (error) {
          return (
            <Card>
              <TableErrorView error={error} />
            </Card>
          );
        }

        const dataTotalCount = data[0] ? data[0].total : 0;
        const isRowSelected = node =>
          allRowsSelected || selectedRows.some(row => row === node.participantId);

        const dataWithRowSelection = data[0]
          ? data[0].nodes.map(node => ({ ...node, selected: isRowSelected(node) }))
          : [];

        const selectionSQON = selectedRows.length
          ? {
            op: 'and',
            content: [{ op: 'in', content: { field: 'kf_id', value: selectedRows } }],
          }
          : sqon;

        return (
          <Card>
            <ParticipantsTable
              sqon={selectionSQON}
              loading={isLoading}
              data={dataWithRowSelection}
              dataTotalCount={data[0] ? data[0].total : 0}
              downloadName={'participant-table'}
              onFetchData={({ page, pageSize, sorted }) => {
                const sorting = sorted
                  .filter(s => SORTABLE_FIELDS_MAPPING.has(s.id))
                  .map(s => ({
                    field: SORTABLE_FIELDS_MAPPING.get(s.id),
                    order: s.desc ? 'desc' : 'asc',
                  }));
                setPageIndex(page);
                setPageSize(pageSize);
                setSort(sorting);
              }}
              onRowSelected={(checked, row) => {
                const rowId = row.participantId;
                setSelectedRows(
                  checked
                    ? s => s.concat(rowId)
                    : s => s.filter(row => row !== rowId)
                );
                trackTableViewAction({
                  category: tableView,
                  subcategory: 'Rows: Single',
                  action: checked ? actions.check : actions.uncheck,
                  label: rowId,
                });
              }}
              onAllRowsSelected={(checked, rows) => {
                // don't keep individual rows selected when "select all" is checked
                //  to avoid having them selected after "unselect all"
                const rowIds = rows.map(row => row.participantId);
                setAllRowsSelected(s => checked);
                setSelectedRows(s => []);
                trackTableViewAction({
                  category: tableView,
                  subcategory: 'Rows: All',
                  action: checked ? actions.check : actions.uncheck,
                  label: rowIds,
                });
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
              analyticsTracking={{ tableView }}
            />
          </Card>
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
