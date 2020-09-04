import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';

import { withApi } from 'services/api';
import { participantsQuery, SORTABLE_FIELDS_MAPPING } from './queries';

import QueriesResolver from '../QueriesResolver';
import ParticipantsTable from './ParticipantsTable';
import TableErrorView from './TableErrorView';

import './index.css';
import { connect } from 'react-redux';
import { getUserSaveSets } from '../../../store/actionCreators/saveSets';
import {
  selectUserSaveSets,
  selectError,
  selectIsLoading,
} from 'store/selectors/saveSetsSelectors';

const ParticipantsTableView = ({
  sqon,
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
  loggedInUser,
  userSaveSets,
  userSets,
}) => {
  useEffect(() => {
    if (loggedInUser) {
      userSaveSets(loggedInUser.egoId);
    }
  }, [userSaveSets, loggedInUser]);

  return (
    <QueriesResolver
      name="GQL_PARTICIPANTS_TABLE"
      api={api}
      queries={[participantsQuery(sqon, sort, pageSize, pageIndex)]}
    >
      {({ isLoading, data, error }) => {
        if (error) {
          return (
            <div className="ptv-error-message">
              <TableErrorView error={error} />
            </div>
          );
        }
        const isRowSelected = (node) =>
          allRowsSelected || selectedRows.some((row) => row === node.participantId);

        const dataWithRowSelection = data[0]
          ? data[0].nodes.map((node) => ({ ...node, selected: isRowSelected(node) }))
          : [];

        const selectionSQON = selectedRows.length
          ? {
              op: 'and',
              content: [{ op: 'in', content: { field: 'kf_id', value: selectedRows } }],
            }
          : sqon;

        return (
          <ParticipantsTable
              sqon={selectionSQON}
              loading={isLoading}
              data={dataWithRowSelection}
              api={api}
              sort={sort}
              dataTotalCount={data[0] ? data[0].total : 0}
              downloadName={'participant-table'}
              onFetchData={({ page, pageSize, sorted }) => {
                const sorting = sorted
                  .filter((s) => SORTABLE_FIELDS_MAPPING.has(s.id))
                  .map((s) => ({
                    field: SORTABLE_FIELDS_MAPPING.get(s.id),
                    order: s.desc ? 'desc' : 'asc',
                  }));
                setPageIndex(page);
                setPageSize(pageSize);
                setSort(sorting);
              }}
              onRowSelected={(checked, row) => {
                const rowId = row.participantId;
                if (checked) {
                  setSelectedRows((s) => s.concat(rowId));
                  return;
                }
                setSelectedRows((s) => s.filter((row) => row !== rowId));
              }}
              onAllRowsSelected={(checked) => {
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
              loggedInUser={loggedInUser}
              saveSets={userSets.sets}
            />

        );
      }}
    </QueriesResolver>
  );
};

ParticipantsTableView.propTypes = {
  sqon: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.user.loggedInUser,
  create: {
    isLoading: selectIsLoading(state),
    error: selectError(state),
  },
  userSets: {
    sets: selectUserSaveSets(state),
    isLoading: false,
    error: null,
    isDeleting: false,
  },
});

const mapDispatchToProps = (dispatch) => ({
  userSaveSets: (userId) => dispatch(getUserSaveSets(userId)),
});

export default compose(
  withApi,
  withState('pageSize', 'setPageSize', 10),
  withState('pageIndex', 'setPageIndex', 0),
  withState('selectedRows', 'setSelectedRows', []),
  withState('allRowsSelected', 'setAllRowsSelected', false),
  withState('sort', 'setSort', []),
  connect(mapStateToProps, mapDispatchToProps),
)(ParticipantsTableView);
