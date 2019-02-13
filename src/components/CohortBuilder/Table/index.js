import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import { withApi } from 'services/api';
import { demographicQuery } from './DemographicTable';

import BaseDataTable from 'uikit/DataTable';
import QueriesResolver from '../QueriesResolver';

const participantsTableViewColumns = [
  { Header: 'Participant ID', accessor: 'participantID' },
  { Header: 'Study Name', accessor: 'studyName' },
  { Header: 'Proband', accessor: 'isProband' },
  { Header: 'Vital Status', accessor: 'vitalStatus' },
];

const enhance = compose(
  withApi,
  withTheme,
);

const Table = ({ theme, sqon, api }) => {
  return (
    <QueriesResolver api={api} sqon={sqon} queries={[demographicQuery({ ...{ sqon } })]}>
      {({ isLoading, data, error }) => {
        if (isLoading || !data) {
          return (
            <div>{`isLoading: ${isLoading}, data: ${data}, data.length: ${(data && data.length) ||
              0}, error: ${error}`}</div>
          );
        }

        return <BaseDataTable columns={participantsTableViewColumns} data={data} />;
      }}
    </QueriesResolver>
  );
};

export default enhance(Table);
