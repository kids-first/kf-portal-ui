import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';

import StyleWrapper from './Table/StyleWrapper';
import CustomPagination from './Pagination';
import applyTransforms from './utils/applyTransforms';

class ControlledDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      className = '',
      columns,
      striped = true,
    } = this.props;
    const { pageSize } = this.state;
    const totalRows = dataTotalCount > -1 ? dataTotalCount : data ? data.length : 0;
    const pages = Math.ceil(totalRows / pageSize);

    const style = this.props.hasOwnProperty("style") ? this.props.style : {};

    return (
      <StyleWrapper style={{...style, borderRight: "none"}}>
        <ReactTable
          columns={columns}
          loading={loading}
          data={applyTransforms(data || [], transforms)}
          manual={true} // manual pagination
          showPagination={this.props.hasOwnProperty("showPagination") ? this.props.showPagination : true}
          pages={pages}
          onFetchData={state => {
            this.setState({
              page: state.page,
              pageSize: state.pageSize,
            });
            onFetchData(state);
          }}
          PaginationComponent={CustomPagination}
          className={`${className} ${striped ? '-striped' : ''}`}
          minRows={1} // hide empty rows
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
      </StyleWrapper>
    );
  }
}

ControlledDataTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    }),
  ).isRequired,
  data: PropTypes.array.isRequired,
  dataTotalCount: PropTypes.number.isRequired,
  onFetchData: PropTypes.func.isRequired,
  transforms: PropTypes.arrayOf(PropTypes.func),
  className: PropTypes.string,
};

export default ControlledDataTable;
