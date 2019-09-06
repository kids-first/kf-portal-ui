import React from 'react';
import PropTypes from 'prop-types';

import ControlledDataTable from 'uikit/DataTable/ControlledDataTable';
import { Tabs } from 'components/FileRepo/AggregationSidebar/CustomAggregationsPanel';

const columns = [
  {
    Header: 'Input ID',
    accessor: 'search',
  },
  {
    Header: 'Input Type',
    accessor: 'type',
  },
  {
    Header: 'Matched Participant IDs',
    accessor: 'participantIds',
  },
];

export default class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'matched',
    };
  }

  static propTypes = {
    results: PropTypes.arrayOf(
      PropTypes.shape({
        participantIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        search: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }).isRequired,
    ),
    query: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const { query, results } = this.props;
    const { selectedTab } = this.state;
    const loading = results === null;
    const unmatched = query.reduce((unmatchedIds, id) => {
      return results.some(res => res.search.toLowerCase() === id.toLowerCase())
        ? unmatchedIds
        : unmatchedIds.concat({ search: id, type: '', participantIds: [] });
    }, []);

    const matched = results;
    return (
      <React.Fragment>
        <Tabs
          selectedTab={selectedTab}
          options={[
            {
              id: 'matched',
              display: 'Matched',
              total: results.length,
            },
            {
              id: 'unmatched',
              display: 'Unmatched',
              total: unmatched.length,
            },
          ]}
          onTabSelect={({ id }) => {
            this.setState({ selectedTab: id, page: 0 });
          }}
        />
        <ControlledDataTable
          loading={loading}
          columns={columns}
          data={selectedTab === 'matched' ? matched : unmatched}
          manualPagination={false}
          defaultPageSize={5}
        />
      </React.Fragment>
    );
  }
}
