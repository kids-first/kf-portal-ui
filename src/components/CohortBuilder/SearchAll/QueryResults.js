import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import { TealActionButton, WhiteButton } from 'uikit/Button';

import QueryResultsBody from './QueryResultsBody';

const ResultsContainer = styled('div')`
  position: absolute;
  display: none;

  top: 100%;
  width: 100%;

  border: 1px solid ${({ theme }) => theme.greyScale5};
  border-radius: 5px;
  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.lighterShadow};
  background-color: white;
  padding: 0;

  &.open {
    display: block;
  }

  .results-content {
    padding: 0;

    .results-header {
      font-family: ${({ theme }) => theme.fonts.details};
      font-style: italic;
      font-size: 12px;
      color: ${({ theme }) => theme.greyScale1};
      width: 100%;
      border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
    }

    .results-footer {
      background-color: ${({ theme }) => theme.greyScale5};
      border-top: 1px solid ${({ theme }) => theme.greyScale5};
    }
  }
`;

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
    <ResultsContainer className={`results-container ${isOpen ? 'open' : ''}`}>
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
    </ResultsContainer>
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
          value: PropTypes.string.isRequired,
          docCount: PropTypes.number.isRequired,
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
