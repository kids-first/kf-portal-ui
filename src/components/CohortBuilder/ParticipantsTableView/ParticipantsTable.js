import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';

import FileIcon from 'icons/FileIcon';
import ControlledDataTable from 'uikit/DataTable/ControlledDataTable';
import { Link } from 'uikit/Core';
import { Toolbar, ToolbarGroup } from 'uikit/DataTable/TableToolbar/styles';
import ColumnFilter from 'uikit/DataTable/ToolbarButtons/ColumnFilter';
import Export from 'uikit/DataTable/ToolbarButtons/Export';
import { trackUserInteraction } from 'services/analyticsTracking';
import { configureCols } from 'uikit/DataTable/utils/columns';

const SelectionCell = ({ value: checked, onCellSelected, row }) => {
  if (row === undefined) {
    // header row
    return (
      <input
        type="checkbox"
        onChange={evt => {
          onCellSelected(evt.currentTarget.checked);
        }}
      />
    );
  }
  return (
    <input type="checkbox" checked={!!checked} onChange={() => onCellSelected(!checked, row)} />
  );
};

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

const NbFilesCell = compose(
  withTheme(({ value: nbFiles, row, theme }) => {
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
  }),
);

const participantsTableViewColumns = (onRowSelected, onAllRowsSelected) => [
  {
    Header: props => <SelectionCell {...props} onCellSelected={onAllRowsSelected} />,
    Cell: props => <SelectionCell {...props} onCellSelected={onRowSelected} />,
    accessor: 'selected',
    filterable: false,
    sortable: false,
  },
  { Header: 'Participant ID', accessor: 'participantId' },
  { Header: 'Study Name', accessor: 'studyName' },
  { Header: 'Proband', accessor: 'isProband' },
  { Header: 'Vital Status', accessor: 'vitalStatus' },
  {
    Header: 'Diagnosis Category',
    accessor: 'diagnosisCategories',
    Cell: props => <CollapsibleMultiLineCell {...props} />,
  },
  {
    Header: 'Diagnosis',
    accessor: 'diagnosis',
    Cell: props => <CollapsibleMultiLineCell {...props} />,
  },
  {
    Header: 'Age at Diagnosis',
    accessor: 'ageAtDiagnosis',
    Cell: props => <CollapsibleMultiLineCell {...props} />,
  },
  { Header: 'Gender', accessor: 'gender' },
  { Header: 'Family ID', accessor: 'familyId' },
  {
    Header: 'Family Composition',
    accessor: 'familyCompositions',
    Cell: props => <CollapsibleMultiLineCell {...props} />,
  },
  { Header: 'Files', accessor: 'filesCount', Cell: props => <NbFilesCell {...props} /> },
];

const cssClass = css({
  '.nbFilesLink img': {
    top: '2px',
    position: 'relative',
  },
});

class ParticipantsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shownColumns: configureCols(
        participantsTableViewColumns(props.onRowSelected, props.onAllRowsSelected),
      ),
    };
  }

  render() {
    const {
      loading,
      data,
      dataTotalCount,
      onFetchData,
      onRowSelected,
      onAllRowsSelected,
      analyticsTracking = null,
      downloadName = 'data',
    } = this.props;
    const { shownColumns } = this.state;

    const allColumns = participantsTableViewColumns(onRowSelected, onAllRowsSelected);

    return (
      <Fragment>
        <Toolbar>
          <ToolbarGroup>
            <Fragment />
          </ToolbarGroup>
          <ToolbarGroup>
            <ColumnFilter
              columns={allColumns}
              onChange={item => {
                const index = allColumns.findIndex(c => c.index === item.index);
                const cols = allColumns.map((col, i) =>
                  i === index ? { ...col, ...{ show: !item.show } } : col,
                );
                const colActedUpon = cols[index];
                if (analyticsTracking) {
                  trackUserInteraction({
                    category: analyticsTracking.category,
                    action: `Datatable: ${analyticsTracking.title}: Column Filter: ${
                      colActedUpon.show ? 'show' : 'hide'
                    }`,
                    label: colActedUpon.Header,
                  });
                }
                this.setState({ shownColumns: cols });
              }}
            />
            <Export {...{ shownColumns, data: data || [], downloadName }}>export</Export>
          </ToolbarGroup>
        </Toolbar>
        <ControlledDataTable
          columns={shownColumns}
          data={data}
          loading={loading}
          className={`${cssClass}`}
          onFetchData={onFetchData}
          dataTotalCount={dataTotalCount}
        />
      </Fragment>
    );
  }
}

ParticipantsTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  dataTotalCount: PropTypes.number.isRequired,
  onFetchData: PropTypes.func.isRequired,
  onRowSelected: PropTypes.func.isRequired,
  onAllRowsSelected: PropTypes.func.isRequired,
  analyticsTracking: PropTypes.shape({
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  downloadName: PropTypes.string,
};

export default ParticipantsTable;
