import React from 'react';
import PropTypes from 'prop-types';

import { TealActionButton, WhiteButton } from 'uikit/Button';
import QueryResultsBody from './QueryResultsBody';

import './SearchAll.css';

const countResults = filteredFields => {
  const totalResults = filteredFields.reduce(
    (sum, field) => sum + field.buckets.length + (field.matchByDisplayName ? 1 : 0),
    0,
  );
  return `${totalResults.toLocaleString()} result${totalResults === 1 ? '' : 's'} found`;
};

const QueryResults = props => {
  const { query, isLoading, onApplyFilter, onClearQuery, filteredFields } = props;
  const isOpen = query !== '';

  if (!isOpen) {
    return null;
  }

  const header = isLoading ? 'Searching...' : countResults(filteredFields);

  return (
    <div className={`results-container ${isOpen ? 'open' : ''}`}>
      <div className="results-content">
        <div className="results-section results-header">{header}</div>
        <QueryResultsBody {...props} />
        <div className="results-section results-footer">
          <WhiteButton onClick={onClearQuery}>Cancel</WhiteButton>
          <TealActionButton disabled={false} onClick={onApplyFilter}>
            Apply
          </TealActionButton>
        </div>
      </div>
    </div>
  );
};

QueryResults.propTypes = {
  filteredFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      matchByDisplayName: PropTypes.bool.isRequired,
      buckets: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          doc_count: PropTypes.number.isRequired,
        }),
      ),
    }),
  ).isRequired,
  query: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  selections: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onClearQuery: PropTypes.func.isRequired,
  onSearchField: PropTypes.func.isRequired,
};

export default QueryResults;
