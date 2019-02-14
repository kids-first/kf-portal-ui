import React from 'react';
import BaseDataTable from 'uikit/DataTable';

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

const StringListView = data => (
  <div>
    {data.map((datum, index) => (
      <div key={index}>{datum}</div>
    ))}
  </div>
);

const formatters = {
  diagnosisCategories: StringListView,
  diagnosis: StringListView,
  ageAtDiagnosis: StringListView,
  familyCompositions: StringListView,
};

const ParticipantsTable = ({ data, isLoading }) => (
  <BaseDataTable
    columns={participantsTableViewColumns}
    data={data}
    transforms={formatters}
    loading={isLoading}
  />
);

export default ParticipantsTable;
