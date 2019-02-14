import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import { withApi } from 'services/api';
import { participantsQuery } from './queries';

import QueriesResolver from '../QueriesResolver';
import ParticipantsTable from './ParticipantsTable';

const enhance = compose(
  withApi,
  withTheme,
);

const ParticipantsTableView = ({ sqon, api }) => {
  return (
    <QueriesResolver api={api} sqon={sqon} queries={[participantsQuery({ ...{ sqon } })]}>
      {({ isLoading, data, error }) =>
        error ? (
          <div>{`${error.name} - ${error.message}`}</div>
        ) : (
          <ParticipantsTable data={data} isLoading={isLoading} />
        )
      }
    </QueriesResolver>
  );
};

export default enhance(ParticipantsTableView);
