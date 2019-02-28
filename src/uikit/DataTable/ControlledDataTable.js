import React, { Fragment, Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';

import StyleWrapper from './Table/StyleWrapper';
import TableToolbar from './TableToolbar';
import ColumnFilter from './ToolbarButtons/ColumnFilter';
import Export from './ToolbarButtons/Export';
import CustomPagination from './Pagination';

import { trackUserInteraction } from 'services/analyticsTracking';
import { configureCols } from './utils/columns';
import applyTransforms from './utils/applyTransforms';

class ControlledDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: configureCols(props.columns),
      page: 0,
      pageSize: props.pageSize || 20,
    };
  }

  render() {
    const {
      loading,
      data,
      dataTotalCount,
      onFetchData,
      transforms = [],
      downloadName = 'data',
      header = true,
      analyticsTracking,
      className = '',
    } = this.props;
    const { columns, page, pageSize } = this.state;
    const totalRows = dataTotalCount > -1 ? dataTotalCount : data ? data.length : 0;
    const pages = Math.ceil(totalRows / pageSize);

    return (
      <Fragment>
        {header ? (
          <TableToolbar page={page} pageSize={pageSize} total={totalRows}>
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
                this.setState({ columns: cols });
              }}
            />

            <Export {...{ columns, data: data || [], downloadName }}>export</Export>
          </TableToolbar>
        ) : null}
        {
          <StyleWrapper>
            <ReactTable
              columns={columns}
              loading={loading}
              data={applyTransforms(data || [], transforms)}
              manual={true} // manual pagination
              showPagination={true}
              pages={pages}
              onFetchData={state => {
                this.setState({
                  page: state.page,
                  pageSize: state.pageSize,
                });
                onFetchData(state);
              }}
              PaginationComponent={CustomPagination}
              className={className}
              minRows={1} // hide empty rows
            />
          </StyleWrapper>
        }
      </Fragment>
    );
  }
}

ControlledDataTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    }),
  ).isRequired,
  data: PropTypes.array.isRequired,
  dataTotalCount: PropTypes.number.isRequired,
  onFetchData: PropTypes.func.isRequired,
  transforms: PropTypes.arrayOf(PropTypes.func),
  downloadName: PropTypes.string,
};

export default ControlledDataTable;
