import React from 'react';
import PropTypes from 'prop-types';

import ControlledDataTable from 'uikit/DataTable/ControlledDataTable';
import Tabs from 'components/Tabs';

const CommaSeparatedValuesCell = ({ value }) => (Array.isArray(value) ? value.join(', ') : value);

const columns = [
  {
    Header: 'Input ID',
    accessor: 'search',
  },
  {
    Header: 'Input Type',
    accessor: 'type',
    className: 'input-type',
  },
  {
    Header: 'Matched Participant IDs',
    accessor: 'participantIds',
    Cell: CommaSeparatedValuesCell,
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
    loading: PropTypes.bool,
  };

  render() {
    const { query, results, loading = false } = this.props;
    const { selectedTab } = this.state;
    const unmatched = loading
      ? 0
      : query.reduce((unmatchedIds, id) => {
          return results.some(res => res.search.toLowerCase() === id.toLowerCase())
            ? unmatchedIds
            : unmatchedIds.concat({ search: id, type: '', participantIds: [] });
        }, []);

    // the service returns uppercase types, lowercase them so they can be transformed in css.
    const matched = results.map(r => ({
      ...r,
      type: (r.type || '').toLowerCase(),
    }));

    return (
      <React.Fragment>
        <Tabs
          selectedTab={selectedTab}
          options={[
            {
              id: 'matched',
              display: 'Matched',
              total: matched.length,
            },
            {
              id: 'unmatched',
              display: 'Unmatched',
              total: unmatched.length,
            },
          ]}
          onTabSelect={id => {
            this.setState({ selectedTab: id });
          }}
        />
        <ControlledDataTable
          loading={loading}
          columns={columns}
          data={selectedTab === 'matched' ? matched : unmatched}
          manualPagination={false}
          showFixedNumberOfRows={true}
          defaultPageSize={5}
        />
      </React.Fragment>
    );
  }
}
