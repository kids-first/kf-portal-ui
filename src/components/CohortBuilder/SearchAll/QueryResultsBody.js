import React from 'react';
import TextHighlight from '@kfarranger/components/dist/TextHighlight';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

const QueryResultsBody = ({
  filteredFields,
  query,
  selections,
  isLoading,
  onSelectionChange,
  onSearchField,
}) => {
  // that query yields no results
  if (filteredFields.length === 0) {
    return null;
  }

  const handleFieldNameClicked = (evt) => {
    const field = filteredFields[evt.currentTarget.dataset.index];
    if (field && field.matchByDisplayName) {
      onSearchField(field.name);
    }
  };

  return (
    <div className="results-section results-body">
      {filteredFields.map((field, i) => (
        <div
          key={`${field.name}`}
          className={`result-category ${field.matchByDisplayName ? 'match' : ''} ${
            filteredFields.length - 1 === i ? 'last' : ''
          }`}
        >
          <div className="category-name" data-index={i} onClick={handleFieldNameClicked}>
            <TextHighlight content={field.displayName} highlightText={query} />
          </div>
          {field.buckets.map(({ key, doc_count }) => (
            <div className="result-item" key={`result-item_${key}`}>
              <label>
                <input
                  type="checkbox"
                  checked={selections[field.name] && selections[field.name].indexOf(key) > -1}
                  className="selection"
                  onChange={(evt) => {
                    onSelectionChange(evt, field, key);
                  }}
                />
                <TextHighlight content={key} highlightText={query} />
              </label>
              <span className="doc-count">{doc_count}</span>
            </div>
          ))}
        </div>
      ))}
      <div className={`loader-container ${isLoading ? 'loading' : ''}`}>
        <Spin />
      </div>
    </div>
  );
};

QueryResultsBody.propTypes = {
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
  selections: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onSearchField: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default QueryResultsBody;
