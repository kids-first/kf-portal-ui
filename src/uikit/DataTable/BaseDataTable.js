import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import PropTypes from 'prop-types';

import Table from './Table';
import TableToolbar from './TableToolbar';
import ColumnFilter from './ToolbarButtons/ColumnFilter';
import Export from './ToolbarButtons/Export';
import { trackUserInteraction } from 'services/analyticsTracking';
import { configureCols } from './utils/columns';
import applyTransforms from './utils/applyTransforms';

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
            columns={columns}
            onChange={item => {
              const index = columns.findIndex(c => c.index === item.index);
              const cols = columns.map((col, i) =>
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

              setColumns(cols);
            }}
          />

          <Export {...{ columns, data: data || [], downloadName }}>export</Export>
        </TableToolbar>
      ) : null}
      <Table
        showPagination={showPagination}
        columns={columns}
        loading={loading}
        data={applyTransforms(data || [], transforms)}
        onPageChange={pageIndex => setPageIndex(pageIndex)}
        onPageSizeChange={(pageSize, pageIndex) => setPageSize(pageSize)}
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
};

export default enhance(BaseDataTable);
