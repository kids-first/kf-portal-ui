import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';

import FileIcon from 'icons/FileIcon';
import BaseDataTable from 'uikit/DataTable';
import { Link } from 'uikit/Core';

const enhance = compose(withState('collapsed', 'setCollapsed', true));
const CollapsibleMultiLineCell = enhance(({ value: data, collapsed, setCollapsed }) => {
  // Display a fourth row when there is exactly 4 rows.
  // Collapsing a single don't save any space.
  const displayedRowCount = collapsed ? (data.length === 4 ? 4 : 3) : data.length;
  const displayMoreButton = data.length > 4;
  return (
    <React.Fragment>
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
            {collapsed ? `${data.length - displayedRowCount} more` : 'Less'}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
});

const NbFilesCell = withTheme(({ value: nbFiles, row, theme }) => {
  const encodedSqon = encodeURI(
    JSON.stringify(
      {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'participants.kf_id',
              value: [row.participantId],
            },
          },
        ],
      },
      null,
      0,
    ),
  );

  return (
    <Link to={`/search/file?sqon=${encodedSqon}`} className="nbFilesLink">
      <FileIcon width={8} height={13} fill={theme.greyScale11} />
      {`${nbFiles} Files`}
    </Link>
  );
});

const participantsTableViewColumns = [
  { Header: 'Participant ID', accessor: 'participantId' },
  { Header: 'Study Name', accessor: 'studyName' },
  { Header: 'Proband', accessor: 'isProband' },
  { Header: 'Vital Status', accessor: 'vitalStatus' },
  {
    Header: 'Diagnosis Category',
    accessor: 'diagnosisCategories',
    Cell: CollapsibleMultiLineCell,
  },
  { Header: 'Diagnosis', accessor: 'diagnosis', Cell: CollapsibleMultiLineCell },
  { Header: 'Age at Diagnosis', accessor: 'ageAtDiagnosis', Cell: CollapsibleMultiLineCell },
  { Header: 'Gender', accessor: 'gender' },
  { Header: 'Family ID', accessor: 'familyId' },
  {
    Header: 'Family Composition',
    accessor: 'familyCompositions',
    Cell: CollapsibleMultiLineCell,
  },
  { Header: 'Files', accessor: 'filesCount', Cell: NbFilesCell },
];

const cssClass = css({
  '.nbFilesLink img': {
    top: '2px',
    position: 'relative',
  },
});

const ParticipantsTable = ({ data = [], isLoading = false }) => (
  <BaseDataTable
    columns={participantsTableViewColumns}
    data={data}
    loading={isLoading}
    className={`${cssClass}`}
  />
);

ParticipantsTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default ParticipantsTable;
