import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';

import StyleWrapper from './Table/StyleWrapper';
import CustomPagination from './Pagination';
import applyTransforms from './utils/applyTransforms';

import { isObject } from 'lodash';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const trackDataTableInteraction = ({ category, action, label }) => {
  trackUserInteraction({
    category,
    action,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label }),
  });
};

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
      tableViewTracking,
    } = this.props;
    const { pageSize } = this.state;
    const totalRows = dataTotalCount > -1 ? dataTotalCount : data ? data.length : 0;
    const pages = Math.ceil(totalRows / pageSize);

    return (
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
          onPageSizeChange={pageSize => {
            if (tableViewTracking) {
              trackDataTableInteraction({
                category: `${tableViewTracking}: Pages: Page Size`,
                action: TRACKING_EVENTS.actions.change,
                label: pageSize.toString(),
              });
            }
          }}
          PaginationComponent={CustomPagination}
          onPageChange={page => {
            if (tableViewTracking) {
              trackDataTableInteraction({
                category: `${tableViewTracking}: Pages: Pagination`,
                action: TRACKING_EVENTS.actions.change,
                label: (page + 1).toString(),
              });
            }
          }}
          className={`${className} ${striped ? '-striped' : ''}`}
          minRows={1} // hide empty rows
          getTheadThProps={(state, rowInfo, column, instance) => {
            return {
              onClick: evt => {
                if (tableViewTracking) {
                  trackDataTableInteraction({
                    category: `${tableViewTracking}: Columns`,
                    action: TRACKING_EVENTS.actions.click,
                    label: column.Header,
                  });
                }
              },
            };
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
  tableViewTracking: PropTypes.string,
};

export default ControlledDataTable;
