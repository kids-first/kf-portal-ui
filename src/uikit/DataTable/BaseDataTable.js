import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import PropTypes from 'prop-types';

import Table from './Table';
import TableToolbar from './TableToolbar';
import ColumnFilter from './ToolbarButtons/ColumnFilter';
import Export from './ToolbarButtons/Export';
import { trackUserInteraction } from 'services/analyticsTracking';
import { configureCols } from './utils/columns';

const enhance = compose(
  withState('pageSize', 'setPageSize', 10),
  withState('pageIndex', 'setPageIndex', 0),
  withState('columns', 'setColumns', props => configureCols(props.columns)),
);

const applyTransforms = (data, transforms) =>
  data.map(datum =>
    Object.keys(transforms)
      .map(key => ({
        field: key,
        value: transforms[key](datum[key]),
      }))
      .reduce(
        (prev, curr) => {
          prev[curr.field] = curr.value;
          return prev;
        },
        { ...datum },
      ),
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
      columns={columns}
      loading={loading}
      data={applyTransforms(data || [], transforms)}
      onPageChange={pageIndex => setPageIndex(pageIndex)}
      onPageSizeChange={(pageSize, pageIndex) => setPageSize(pageSize)}
    />
  </Fragment>
);

BaseDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    }),
  ).isRequired,
  data: PropTypes.array.isRequired,
};

export default enhance(BaseDataTable);
