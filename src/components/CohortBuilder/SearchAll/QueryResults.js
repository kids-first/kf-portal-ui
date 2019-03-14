import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import TextHighlight from '@arranger/components/dist/TextHighlight';
import { TealActionButton, WhiteButton } from 'uikit/Button';

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

const filterFields = (detailedFields, query) => {
  return detailedFields
    .map(field => {
      const filteredBuckets = field.buckets.filter(
        ({ value }) => value.toLowerCase().indexOf(query.toLowerCase()) > -1,
      );
      return {
        ...field,
        buckets: filteredBuckets,
      };
    })
    .filter(field => field.buckets.length > 0);
};

const QueryResultsBody = ({ filteredFields, query, selections, onSelectionChange }) => {
  // that query yields no results
  if (filteredFields.length === 0) {
    return null;
  }

  return (
    <div className="results-section results-body">
      {filteredFields.map(field => (
        <div key={`${field.name}`} className="result-category">
          <div className="category-name">{field.displayName}</div>
          {field.buckets.map(({ value, docCount }) => (
            <div className="result-item" key={`result-item_${value}`}>
              <input
                type="checkbox"
                checked={selections[field.name].indexOf(value) > -1}
                className="selection"
                onChange={evt => {
                  onSelectionChange(evt, field, value);
                }}
              />
              <TextHighlight content={value} highlightText={query} />
              <span className="doc-count">{docCount}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const QueryResults = props => {
  const { query, isLoading, onApplyFilter, onClearQuery, detailedFields } = props;
  const isOpen = query !== '';

  if (!isOpen) {
    return null;
  }

  // TODO handle loading state correctly
  if (isLoading) {
    return null;
  }

  // filter both the fields and their buckets
  //  to keep only the field values matching the query
  const filteredFields = filterFields(detailedFields, query);

  // TODO extract results count
  const totalResults = filteredFields.reduce((sum, field) => sum + field.buckets.length, 0);

  return (
    <ResultsContainer className={`results-container ${isOpen ? 'open' : ''}`}>
      <div className="results-content">
        <div className="results-section results-header">{`${totalResults.toLocaleString()} result${
          totalResults === 1 ? '' : 's'
        } found`}</div>
        <QueryResultsBody filteredFields={filteredFields} {...props} />
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
  detailedFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  query: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  selections: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onClearQuery: PropTypes.func.isRequired,
};

export default QueryResults;
