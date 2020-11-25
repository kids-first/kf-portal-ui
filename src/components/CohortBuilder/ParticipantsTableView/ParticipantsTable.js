import React, { Component } from 'react';
import PropTypes from 'prop-types';
import union from 'lodash/union';
import compact from 'lodash/compact';
import { compose, withState } from 'recompose';
import autobind from 'auto-bind-es5';
import ControlledDataTable from 'uikit/DataTable/ControlledDataTable';
import { Link } from 'uikit/Core';
import { Toolbar, ToolbarGroup, ToolbarSelectionCount } from 'uikit/DataTable/TableToolbar/styles';
import ColumnFilter from 'uikit/DataTable/ToolbarButtons/ColumnFilter';
import Export from 'uikit/DataTable/ToolbarButtons/Export';
import { configureCols } from 'uikit/DataTable/utils/columns';
import { trackUserInteraction } from 'services/analyticsTracking';
import { SORTABLE_FIELDS_MAPPING } from './queries';
import FileIcon from 'icons/FileIcon';
import { MONDOLink } from '../../Utils/DiagnosisAndPhenotypeLinks';

import { connect } from 'react-redux';
import { addTermToActiveIndex } from 'store/actionCreators/virtualStudies';
import { Tooltip } from 'antd';
import { externalLink } from 'uikit/ExternalLink.module.css';
import './ParticipantTableView.css';
import style from 'style/themes/default/colors.module.scss';

const SelectionCell = ({ value: checked, onCellSelected, row }) => (
  <input
    type="checkbox"
    checked={!!checked}
    onChange={
      row
        ? () => onCellSelected(!checked, row)
        : (evt) => {
            onCellSelected(evt.currentTarget.checked);
          }
    }
  />
);

const isMondo = (datum) => typeof datum === 'string' && datum.includes('MONDO');

const enhance = compose(withState('collapsed', 'setCollapsed', true));

const CollapsibleMultiLineCell = enhance(({ value: data, collapsed, setCollapsed }) => {
  // Display one row when there is exactly more than one row.
  // Collapsing a single don't save any space.
  const cleanedUniquifiedData = compact(union(data));

  const sizeOfCleanData = cleanedUniquifiedData.length;

  const displayedRowCount = collapsed ? 1 : sizeOfCleanData;
  const displayMoreButton = sizeOfCleanData > 1;
  const hasManyValues = sizeOfCleanData > 1;

  return (
    <div className="rowCss">
      <div style={{ display: 'flex', flexDirection: 'column', flex: '4' }}>
        {cleanedUniquifiedData.slice(0, displayedRowCount).map((datum, index) => {
          if (isMondo(datum)) {
            return <MONDOLink key={index} mondo={datum} />;
          } else {
            return (
              <div key={index}>
                {hasManyValues && '\u2022'}
                {datum === null
                  ? '\u00A0' /* unbreakable space to avoid empty rows from collapsing in height */
                  : datum}
              </div>
            );
          }
        })}
      </div>
      {displayMoreButton && (
        <div
          style={{ flex: '1', marginTop: '-8px ' }}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          <div className={`showMore-wrapper ${collapsed ? 'more' : 'less'}`}>
            {collapsed ? `${sizeOfCleanData - displayedRowCount} ` : ''}
          </div>
        </div>
      )}
    </div>
  );
});

const NbFilesCell = ({ value: nbFiles, row }) => {
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
      <FileIcon style={{ marginRight: '5px' }} width="8px" height="13px" fill="#a9adc0" />
      {`${nbFiles} Files`}
    </Link>
  );
};

const ParticipantIdLink = ({ value: idParticipant }) => (
  <Link to={`/participant/${idParticipant}#summary`}>{`${idParticipant}`}</Link>
);

const CellSelectionCell = (value, row, onCellSelected) => (
  <SelectionCell value={value} row={row} onCellSelected={onCellSelected} />
);

const HeaderSelectionCell = (props, value, onCellSelected) => (
  <SelectionCell {...props} value={value} onCellSelected={onCellSelected} />
);

const CellCollapsibleMultiLineCell = (value, collapsed, setCollapsed) => (
  <CollapsibleMultiLineCell value={value} collapsed={collapsed} setCollapsed={setCollapsed} />
);

const CellNbFilesCell = (value, row) => <NbFilesCell value={value} row={row} />;

const CellParticipantIdLink = (value) => <ParticipantIdLink value={value} />;

const participantsTableViewColumns = (
  onRowSelected,
  onAllRowsSelected,
  dirtyHack,
  addSqonTermToActiveIndex,
) => [
  {
    Header: (props) => HeaderSelectionCell(props, dirtyHack.allRowsSelected, onAllRowsSelected),
    Cell: (props) => CellSelectionCell(props.value, props.row, onRowSelected),
    accessor: 'selected',
    filterable: false,
    sortable: false,
    skipExport: true,
    resizable: false,
    minWidth: 33,
  },
  {
    Header: 'Participant ID',
    accessor: 'participantId',
    Cell: (props) => CellParticipantIdLink(props.value),
  },
  {
    Header: 'Study Name',
    accessor: 'studyName',
    minWidth: 140,
  },
  { Header: 'Proband', accessor: 'isProband', minWidth: 65 },
  { Header: 'Vital Status', accessor: 'vitalStatus', minWidth: 70 },
  {
    Header: 'Diagnosis Category',
    accessor: 'diagnosisCategories',
    Cell: (props) => CellCollapsibleMultiLineCell(props.value, props.collapsed, props.setCollapsed),
    field: 'diagnoses.diagnosis_category',
    sortable: false,
  },
  {
    Header: 'Diagnosis (Mondo)',
    accessor: 'diagnosisMondo',
    Cell: (props) => CellCollapsibleMultiLineCell(props.value, props.collapsed, props.setCollapsed),
    field: 'diagnoses.mondo_id_diagnosis',
    minWidth: 175,
    sortable: false,
  },
  {
    Header: 'Age at Diagnosis (days)',
    accessor: 'ageAtDiagnosis',
    Cell: (props) => CellCollapsibleMultiLineCell(props.value, props.collapsed, props.setCollapsed),
    field: 'diagnoses.age_at_event_days',
    sortable: false,
  },
  { Header: 'Gender', accessor: 'gender', field: 'gender', minWidth: 70 },
  {
    Header: 'Family ID',
    accessor: 'familyId',
    // eslint-disable-next-line react/display-name,react/prop-types
    Cell: ({ value: familyId }) =>
      familyId ? (
        <Tooltip title="Add to query">
          <span
            onClick={() => addSqonTermToActiveIndex({ value: familyId, field: 'family_id' })}
            className={externalLink}
          >
            {familyId}
          </span>
        </Tooltip>
      ) : (
        ''
      ),
    field: 'family_id',
  },
  {
    Header: 'Family Composition',
    accessor: 'familyCompositions',
    Cell: (props) => CellCollapsibleMultiLineCell(props.value, props.collapsed, props.setCollapsed),
    field: 'family.family_compositions',
    sortable: false,
  },
  {
    Header: 'Files',
    accessor: 'filesCount',
    Cell: (props) => CellNbFilesCell(props.value, props.row),
    field: 'files',
    sortable: false,
  },
];

class ParticipantsTable extends Component {
  static defaultProps = {
    sqon: {
      op: 'and',
      content: [],
    },
  };

  constructor(props) {
    super(props);
    // TODO clean that once react-table is updated.
    this.dirtyHack = { allRowsSelected: props.allRowsSelected };
    this.state = {
      columns: configureCols(
        participantsTableViewColumns(
          props.onRowSelected,
          props.onAllRowsSelected,
          this.dirtyHack,
          props.addSqonTermToActiveIndex,
        ),
      ).map((field) =>
        field.sortable !== false && SORTABLE_FIELDS_MAPPING.has(field.accessor)
          ? { ...field, sortable: true }
          : { ...field, sortable: false },
      ),
    };
    autobind(this);
  }

  render() {
    const {
      loading,
      data,
      api,
      sort,
      dataTotalCount,
      onFetchData,
      onClearSelected,
      analyticsTracking = null,
      downloadName = 'data',
      selectedRows,
      allRowsSelected,
      sqon,
    } = this.props;
    // I know. Sometimes, you gotta do what you gotta do.
    this.dirtyHack.allRowsSelected = allRowsSelected;
    const { columns } = this.state;
    const selectedRowsCount = allRowsSelected ? dataTotalCount : selectedRows.length;

    return (
      <>
        <Toolbar style={{ border: 'none' }}>
          <ToolbarGroup style={{ border: 'none' }}>
            {selectedRowsCount > 0 ? (
              <ToolbarSelectionCount>
                <span>{selectedRowsCount}</span>
                <span>{`\u00A0participant${
                  selectedRowsCount > 1 ? 's are' : ' is'
                } selected\u00A0`}</span>
                <button onClick={() => onClearSelected()} className="clearSelection">
                  {'clear selection'}
                </button>
              </ToolbarSelectionCount>
            ) : null}
          </ToolbarGroup>
          <div className={'action-btns-layout'}>
            <ColumnFilter
              colsPickerBtnClassName={`cols-picker-btn ${style.btnDefaultColor}`}
              columns={columns}
              defaultCols={[...columns]}
              onChange={(updatedCols, updatedCol) => {
                if (analyticsTracking && updatedCol) {
                  trackUserInteraction({
                    category: analyticsTracking.category,
                    action: `Datatable: ${analyticsTracking.title}: Column Filter: ${
                      updatedCol.show ? 'show' : 'hide'
                    }`,
                    label: updatedCol.Header,
                  });
                }
                this.setState({ columns: updatedCols });
              }}
            />
            <Export
              {...{
                columns,
                selectedRows: selectedRows || [],
                downloadName,
                api,
                sqon: sqon,
                sort,
                dataTotalCount,
                exportBtnClassName: `export-btn ${style.btnDefaultColor}`,
              }}
            />
          </div>
        </Toolbar>
        <ControlledDataTable
          columns={columns}
          data={data}
          loading={loading}
          className="participantTable"
          onFetchData={onFetchData}
          dataTotalCount={dataTotalCount}
        />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addSqonTermToActiveIndex: (term) => dispatch(addTermToActiveIndex(term)),
});

ParticipantsTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  dataTotalCount: PropTypes.number.isRequired,
  onFetchData: PropTypes.func.isRequired,
  onRowSelected: PropTypes.func.isRequired,
  onAllRowsSelected: PropTypes.func.isRequired,
  onClearSelected: PropTypes.func.isRequired,
  analyticsTracking: PropTypes.shape({
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  downloadName: PropTypes.string,
  selectedRows: PropTypes.arrayOf(PropTypes.string).isRequired,
  allRowsSelected: PropTypes.bool.isRequired,
  api: PropTypes.func.isRequired,
  addSqonTermToActiveIndex: PropTypes.func,
  sort: PropTypes.func,
  sqon: PropTypes.any,
};

export default connect(null, mapDispatchToProps)(ParticipantsTable);
