import React from 'react';
import { compose } from 'recompose';
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
);

const ParticipantsTableView = ({ sqon, api }) => (
  <QueriesResolver api={api} sqon={sqon} queries={[participantsQuery(sqon)]}>
    {({ isLoading, data, error, sqon }) =>
      error ? (
        <TableErrorView error={error} />
      ) : (
        <React.Fragment>
          {!sqon ? <EmptyCohortOverlay /> : null}
          <ParticipantsTable data={data ? data[0] : null} isLoading={isLoading} />
        </React.Fragment>
      )
    }
  </QueriesResolver>
);

export default enhance(ParticipantsTableView);
