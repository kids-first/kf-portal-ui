import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { compose, withState } from 'recompose';
import BaseDataTable from 'uikit/DataTable';

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
        <div
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          <div className={`showMore-wrapper ${collapsed ? 'more' : 'less'}`}>
            {collapsed ? ' More' : 'Less'}
          </div>
        </div>
      ) : null}
    </div>
  );
});

const StyledCollapsibleMultiLineCell = styled(CollapsibleMultiLineCell)`
  padding-bottom: 5px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  color: #cc3399;
  border-bottom: ${({ active, theme }) => (active ? `2px solid ${theme.borderPurple}` : null)};
  align-items: center;
  justify-content: left;

  &:hover {
    cursor: pointer;
  }
`;

const participantsTableViewColumns = [
  { Header: 'Participant ID', accessor: 'participantId' },
  { Header: 'Study Name', accessor: 'studyName' },
  { Header: 'Proband', accessor: 'isProband' },
  { Header: 'Vital Status', accessor: 'vitalStatus' },
  {
    Header: 'Diagnosis Category',
    accessor: 'diagnosisCategories',
    Cell: StyledCollapsibleMultiLineCell,
  },
  { Header: 'Diagnosis', accessor: 'diagnosis', Cell: StyledCollapsibleMultiLineCell },
  { Header: 'Age at Diagnosis', accessor: 'ageAtDiagnosis', Cell: StyledCollapsibleMultiLineCell },
  { Header: 'Gender', accessor: 'gender' },
  { Header: 'Family ID', accessor: 'familyId' },
  {
    Header: 'Family Composition',
    accessor: 'familyCompositions',
    Cell: StyledCollapsibleMultiLineCell,
  },
  { Header: 'Files', accessor: 'filesCount', Cell: ({ value: nbFiles }) => `${nbFiles} Files` },
];

const ParticipantsTable = ({ data = [], isLoading }) => (
  <BaseDataTable columns={participantsTableViewColumns} data={data} loading={isLoading} />
);

ParticipantsTable.propTypes = {
  data: PropTypes.array,
};

export default ParticipantsTable;
