import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import { withApi } from 'services/api';
import { demographicQuery } from './DemographicTable';

import BaseDataTable from 'uikit/DataTable';
import QueriesResolver from '../QueriesResolver';

const participantsTableViewColumns = [
  { Header: 'Participant ID', accessor: 'participantId' },
  { Header: 'Study Name', accessor: 'studyName' },
  { Header: 'Proband', accessor: 'isProband' },
  { Header: 'Vital Status', accessor: 'vitalStatus' },
  { Header: 'Diagnosis Category', accessor: 'diagnosisCategories' },
  { Header: 'Diagnosis', accessor: 'diagnosis' },
  { Header: 'Age at Diagnosis', accessor: 'ageAtDiagnosis' },
  { Header: 'Gender', accessor: 'gender' },
  { Header: 'Family ID', accessor: 'familyId' },
  { Header: 'Family Composition', accessor: 'familyCompositions' },
  { Header: 'Files', accessor: 'filesCount' },
];

const stringListView = data => (
  <div>
    {data.map((datum, index) => (
      <div key={index}>{datum}</div>
    ))}
  </div>
);

const enhance = compose(
  withApi,
  withTheme,
);

const Table = ({ theme, sqon, api }) => {
  return (
    <QueriesResolver api={api} sqon={sqon} queries={[demographicQuery({ ...{ sqon } })]}>
      {({ isLoading, data, error }) => {
        const formatters = {
          diagnosisCategories: stringListView,
          diagnosis: stringListView,
          ageAtDiagnosis: stringListView,
          familyCompositions: stringListView,
        };

          return (
          <BaseDataTable
            columns={participantsTableViewColumns}
            data={data || []} // ¯\_(ツ)_/¯
            transforms={formatters}
            loading={isLoading}
          />
          );
      }}
    </QueriesResolver>
  );
};

export default enhance(Table);
