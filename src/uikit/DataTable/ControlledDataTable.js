import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import CustomPagination from './Pagination';
import applyTransforms from './utils/applyTransforms';

import './Table/Table.css';

export default class ControlledDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pageSize: props.defaultPageSize || 20,
    };
  }

  static propTypes = {
    loading: PropTypes.bool,
    // see ReactTable v6 Columns doc: https://github.com/tannerlinsley/react-table/tree/v6#columns
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        Header: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        accessor: PropTypes.string.isRequired,
        Cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      }),
    ).isRequired,
    data: PropTypes.array.isRequired,
    dataTotalCount: PropTypes.number,
    manualPagination: PropTypes.bool,
    onFetchData: PropTypes.func,
    transforms: PropTypes.arrayOf(PropTypes.func),
    // class to be assigned to the table
    className: PropTypes.string,
    // alternate rows color
    striped: PropTypes.bool,
    // display empty rows when on the last (or only) page,
    // so the table have the same amount of rows on each page
    showFixedNumberOfRows: PropTypes.bool,
  };

  render() {
    const {
      loading = false,

      data,
      transforms = [],
      columns,

      // styling-related stuff
      className = '',
      striped = true,
      style = {},

      // pagination-related stuff
      showPagination = true,
      manualPagination = true,
      showFixedNumberOfRows = false,
      defaultPageSize = 20,
      dataTotalCount = -1,
      onFetchData = noop,
    } = this.props;

    // pagination-related stuff
    const { pageSize } = this.state;
    const totalRows = Math.max(dataTotalCount, data ? data.length : 0);
    const pages = Math.ceil(totalRows / pageSize);

    return (
      <div className="dataTable" style={{ ...style, borderRight: 'none' }}>
        <ReactTable
          columns={columns}
          loading={loading}
          data={applyTransforms(data || [], transforms)}
          manual={manualPagination}
          showPagination={showPagination}
          pages={pages}
          defaultPageSize={defaultPageSize}
          onFetchData={fetchState => {
            this.setState({
              page: fetchState.page,
              pageSize: fetchState.pageSize,
            });
            onFetchData(fetchState);
          }}
          PaginationComponent={CustomPagination}
          className={`${className} ${striped ? '-striped' : ''}`}
          minRows={showFixedNumberOfRows ? pageSize : 1} // 1 = hide empty rows
          getTrProps={(state, rowInfo) => {
            if (rowInfo && rowInfo.row) {
              return {
                style: {
                  background: rowInfo.row.selected ? '#edf9fe' : '',
                },
              };
            } else {
              return {};
            }
          }}
        />
      </div>
    );
  }
}
