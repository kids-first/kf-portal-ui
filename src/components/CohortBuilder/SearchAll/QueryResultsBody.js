import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';

import TextHighlight from '@arranger/components/dist/TextHighlight';
import LoadingSpinner from 'uikit/LoadingSpinner';

const QueryResultsBody = ({
  filteredFields,
  query,
  selections,
  isLoading,
  theme,
  onSelectionChange,
}) => {
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
      <div className={`loader-container ${isLoading ? 'loading' : ''}`}>
        <LoadingSpinner color={theme.greyScale11} size={'50px'} />
      </div>
    </div>
  );
};

QueryResultsBody.propTypes = {
  filteredFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      displayName: PropTypes.string,
      buckets: PropTypes.shape({
        value: PropTypes.string.isRequired,
        docCount: PropTypes.number.isRequired,
      }).isRequired,
    }),
  ).isRequired,
  query: PropTypes.string.isRequired,
  selections: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default withTheme(QueryResultsBody);
