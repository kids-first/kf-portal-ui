import React from 'react';
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
);

const ParticipantsTableView = ({ sqon, api, pageIndex, pageSize, setPageIndex, setPageSize }) => (
  <QueriesResolver api={api} sqon={sqon} queries={[participantsQuery(sqon, pageSize, pageIndex)]}>
    {({ isLoading, data, error }) =>
      error ? (
        <TableErrorView error={error} />
      ) : (
        <ParticipantsTable
          loading={isLoading}
          data={data[0] ? data[0].nodes : []}
          dataTotalCount={data[0] ? data[0].total : 0}
          onFetchData={({ page, pageSize }) => {
            setPageIndex(page);
            setPageSize(pageSize);
          }}
        />
      )
    }
  </QueriesResolver>
);

export default enhance(ParticipantsTableView);
