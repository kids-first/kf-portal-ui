import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import BaseDataTable from 'uikit/DataTable';
import ViewLink from 'uikit/ViewLink';

const enhance = compose(withState('collapsed', 'setCollapsed', true));
const CollapsibleMultiLineCell = enhance(({ value: data, collapsed, setCollapsed }) => {

  // Display a fourth row when there is exactly 4 rows.
  // Collapsing a single don't save any space.
  const displayedRowCount = collapsed ? (data.length === 4 ? 4 : 3) : data.length;
  const displayMoreButton = data.length > 4;
  return (
    <div>
      {data.slice(0, displayedRowCount).map((datum, index) => (
        <div key={index}>
          {datum === null
            ? '\u00A0' /* unbreakable space to avoid empty rows from collapsing in height */
            : datum}
        </div>
      ))}
      {displayMoreButton ? (
        <ViewLink
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          style={{ alignItems: 'left', justifyContent: 'left' }}
        >
          <div className={`showMore-wrapper ${collapsed ? 'more' : 'less'}`}>
            {collapsed ? ' More' : 'Less'}
          </div>
        </ViewLink>
      ) : null}
    </div>
  );
});

const participantsTableViewColumns = [
  { Header: 'Participant ID', accessor: 'participantId' },
  { Header: 'Study Name', accessor: 'studyName' },
  { Header: 'Proband', accessor: 'isProband' },
  { Header: 'Vital Status', accessor: 'vitalStatus' },
  { Header: 'Diagnosis Category', accessor: 'diagnosisCategories', Cell: CollapsibleMultiLineCell },
  { Header: 'Diagnosis', accessor: 'diagnosis', Cell: CollapsibleMultiLineCell },
  { Header: 'Age at Diagnosis', accessor: 'ageAtDiagnosis', Cell: CollapsibleMultiLineCell },
  { Header: 'Gender', accessor: 'gender' },
  { Header: 'Family ID', accessor: 'familyId' },
  { Header: 'Family Composition', accessor: 'familyCompositions', Cell: CollapsibleMultiLineCell },
  { Header: 'Files', accessor: 'filesCount', Cell: ({ value: nbFiles }) => `${nbFiles} Files` },
];

const ParticipantsTable = ({ data = [], isLoading }) => (
  <BaseDataTable columns={participantsTableViewColumns} data={data} loading={isLoading} />
);

ParticipantsTable.propTypes = {
  data: PropTypes.array,
};

export default ParticipantsTable;
