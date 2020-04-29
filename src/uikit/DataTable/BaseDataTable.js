import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import PropTypes from 'prop-types';

import Table from './Table';
import TableToolbar from './TableToolbar';
import ColumnFilter from './ToolbarButtons/ColumnFilter';
import { trackUserInteraction } from 'services/analyticsTracking';
import { configureCols } from './utils/columns';
import applyTransforms from './utils/applyTransforms';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import exportTSV from './ToolbarButtons/exportTSV';
import './BaseDataTable.css';

const enhance = compose(
  withState('pageSize', 'setPageSize', props => (props.showPagination ? 10 : props.data.length)),
  withState('pageIndex', 'setPageIndex', 0),
  withState('columns', 'setColumns', props => configureCols(props.columns)),
);

const BaseDataTable = ({
  loading,
  data = [],
  transforms = {},
  columns,
  setColumns,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
  downloadName,
  header = true,
  analyticsTracking,
  className = '',
  showPagination,
}) => (
  <Fragment>
    {header ? (
      <TableToolbar pageSize={pageSize} page={pageIndex} total={data ? data.length : 0}>
        <ColumnFilter
          colsPickerBtnClassName={'cols-picker-btn'}
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
            setColumns(updatedCols);
          }}
        />
        <Button
          className={'export-btn'}
          icon={<DownloadOutlined />}
          onClick={() => exportTSV(data || [], columns, downloadName)}
        >
          Export
        </Button>
      </TableToolbar>
    ) : null}
    <Table
      showPagination={showPagination}
      columns={columns}
      loading={loading}
      data={applyTransforms(data || [], transforms)}
      onPageChange={pageIndex => setPageIndex(pageIndex)}
      onPageSizeChange={(pageSize, _) => setPageSize(pageSize)}
      className={className}
    />
  </Fragment>
);

BaseDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    }),
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  transforms: PropTypes.object,
  setColumns: PropTypes.func.isRequired,
  header: PropTypes.bool,
  className: PropTypes.string,
  showPagination: PropTypes.bool,
  analyticsTracking: PropTypes.object,
  downloadName: PropTypes.string,
  setPageIndex: PropTypes.func,
  setPageSize: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
};

export default enhance(BaseDataTable);
