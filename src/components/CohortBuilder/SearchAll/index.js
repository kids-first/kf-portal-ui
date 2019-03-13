import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import SearchIcon from 'react-icons/lib/fa/search';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import autobind from 'auto-bind';

import ExtendedMappingProvider from '@arranger/components/dist/utils/ExtendedMappingProvider';
import TextHighlight from '@arranger/components/dist/TextHighlight';

import { withApi } from 'services/api';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle';
import Column from 'uikit/Column';
import { TealActionButton, WhiteButton } from 'uikit/Button';
import LoadingSpinner from 'uikit/LoadingSpinner';
import { arrangerProjectId } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';

import QueriesResolver from '../QueriesResolver';
import { searchAllFieldsQuery } from './queries';

import './SearchAll.css';

const SearchAllContainer = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 1;

  .query-container {
    height: 100%;
    padding-top: 17px;
    padding-left: 12px;
    padding-right: 14px;
  }

  .results-container: {
    position: absolute;
    top: 100%;
  }
`;

const QueryContainer = styled(Column)`
  display: flex;
  flex-shrink: 0;
  border-top: 4px solid ${({ borderColor }) => borderColor};
  border-right: 1px solid ${({ theme }) => theme.greyScale8};
  padding: 7px;

  .query-content {
    border-radius: 10px;
    border: solid 2px ${({ theme }) => theme.greyScale8};

    & input {
      font-family: ${({ theme }) => theme.fonts.details};
      font-weight: bold;
      font-size: 14px;
      color: ${({ theme }) => theme.greyScale1};
    }

    &:hover {
      box-shadow: 0 0 10px skyblue;
    }
  }

  .input-icon {
    color: ${({ theme }) => theme.greyScale11};

    &.icon-right {
      color: ${({ theme }) => theme.greyScale1};
    }
  }
`;

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

const toGqlFieldPath = fieldPath => fieldPath.replace(/\./g, '__');

const initializeSelection = (fields, sqon) => {
  const initialValues = sqon.content.reduce((acc, op) => {
    if (op.op === 'in') {
      acc[op.content.field] = op.content.value;
    }
    return acc;
  }, {});

  return fields.reduce((acc, field) => {
    acc[field] = initialValues[field] ? [...initialValues[field]] : [];
    return acc;
  }, {});
};

class SearchAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      selections: initializeSelection(props.fields, props.sqon),
      isOpen: false,
    };
    autobind(this);
  }

  close() {
    this.setState({
      query: '',
      isOpen: false,
      selections: {},
    });
  }

  setQuery(query) {
    const { isOpen } = this.state;
    const { fields, sqon } = this.props;
    const selections =
      !isOpen && query.length > 0 ? initializeSelection(fields, sqon) : this.state.selections;

    this.setState({
      query,
      isOpen: query !== '',
      selections,
    });
  }

  handleQueryChange(evt) {
    this.setQuery(evt.currentTarget.value);
  }

  handleClearQuery() {
    this.close();
  }

  handleSelectionChange(field, value, evt) {
    const checked = evt.currentTarget.checked;
    const oldValues = this.state.selections[field.name];
    const index = oldValues.indexOf(value);

    let fieldSelection = [];
    if (checked && index === -1) {
      fieldSelection = oldValues.concat(value);
    }

    if (!checked && index > -1) {
      fieldSelection = fieldSelection.concat(oldValues.slice(0, index), oldValues.slice(index + 1));
    }

    this.setState({
      selections: {
        ...this.state.selections,
        [field.name]: fieldSelection,
      },
    });
  }

  handleApplyFilter(evt) {
    const { sqon, fields, onSqonUpdate } = this.props;
    const { selections } = this.state;

    const newSqonPerField = fields
      .filter(field => selections[field].length > 0)
      .reduce(
        (acc, field) =>
          acc.concat({
            op: 'in',
            content: {
              field,
              value: [...selections[field]],
            },
          }),
        [],
      );

    const newSqon = {
      op: sqon.op,
      content: sqon.content
        .filter(op => op.op !== 'in' || !selections[op.content.field])
        .concat(newSqonPerField),
    };

    onSqonUpdate(newSqon);

    this.close();
  }

  renderQueryResults(detailedFields) {
    const { query, isOpen } = this.state;
    return detailedFields.map(field => {
      if (!isOpen) {
        return null;
      }

      const filteredBuckets = field.buckets.filter(
        ({ value }) => value.toLowerCase().indexOf(query.toLowerCase()) > -1,
      );

      if (filteredBuckets.length === 0) {
        return null;
      }

      return (
        <div key={`${field.name}`} className="result-category">
          <div className="category-name">{field.displayName}</div>
          {filteredBuckets.map(({ value, docCount }) => (
            <div className="result-item" key={`result-item_${value}`}>
              <input
                type="checkbox"
                checked={this.state.selections[field.name].indexOf(value) > -1}
                className="selection"
                onChange={this.handleSelectionChange.bind(this, field, value)}
              />
              <TextHighlight content={value} highlightText={query} />
              <span className="doc-count">{docCount}</span>
            </div>
          ))}
        </div>
      );
    });
  }

  render() {
    const { api, sqon, color, title, fields, theme } = this.props;
    const { query, isOpen } = this.state;
    const resultsCount = 0;

    return (
      // Extract the metadata & data fetching to a component
      // Also, wrap in a multiplexer :p
      <ExtendedMappingProvider
        api={api}
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        useCache={true}
      >
        {({ loading: extendedMappingIsLoading, extendedMapping }) => {
          // TODO JB - perf
          const filteredExtendedMapping = (extendedMapping || [])
            // only keep the fields we're interested in
            .filter(emf => fields.some(field => field === emf.field));

          return (
            <QueriesResolver
              name="GQL_PARTICIPANTS_TABLE"
              api={api}
              sqon={sqon}
              queries={[searchAllFieldsQuery(sqon, fields)]}
            >
              {({ isLoading, data, error }) => {
                if (error) {
                  console.error(error);
                  // TODO JB : proper error handling
                  return 'ERROR';
                }

                if (extendedMappingIsLoading || isLoading) {
                  return <LoadingSpinner color={theme.greyScale11} size={'30px'} />;
                }

                const aggFields = data[0];
                const detailedFields = fields
                  .map(fieldName => {
                    const aggField = aggFields[toGqlFieldPath(fieldName)];
                    if (!aggField) {
                      console.log(`[SearchAll] Field ${fieldName} metadata could not be found`);
                      return null;
                    }
                    const fieldExtendedMapping = filteredExtendedMapping.find(
                      fem => fem.field === fieldName,
                    );
                    return {
                      name: fieldName,
                      displayName: fieldExtendedMapping.displayName,
                      buckets: aggField.buckets.map(b => ({
                        value: b.key,
                        docCount: b['doc_count'],
                      })),
                    };
                  })
                  .filter(f => f !== null);

                return (
                  <SearchAllContainer className="search-all-filter">
                    <QueryContainer borderColor={color} className="query-container">
                      <div className="query-content">
                        <span className={'input-icon icon-left'}>
                          <SearchIcon />
                        </span>
                        <input
                          type="text"
                          value={query}
                          onChange={this.handleQueryChange}
                          aria-label={title}
                          placeholder={title}
                        />
                        {query && (
                          <span className={'input-icon icon-right'}>
                            <FaTimesCircleO onClick={this.handleClearQuery} />
                          </span>
                        )}
                      </div>
                    </QueryContainer>
                    <ResultsContainer className={`results-container${isOpen ? ' open' : ''}`}>
                      <div className="results-content">
                        <div className="results-section results-header">{`${resultsCount.toLocaleString()} results found`}</div>
                        <div className="results-section results-body">
                          {isLoading || !isOpen ? null : this.renderQueryResults(detailedFields)}
                        </div>
                        <div className="results-section results-footer">
                          <WhiteButton onClick={this.handleClearQuery}>Cancel</WhiteButton>
                          <TealActionButton disabled={false} onClick={this.handleApplyFilter}>
                            Apply
                          </TealActionButton>
                        </div>
                      </div>
                    </ResultsContainer>
                  </SearchAllContainer>
                );
              }}
            </QueriesResolver>
          );
        }}
      </ExtendedMappingProvider>
    );
  }
}

SearchAll.defaultProps = {
  color: 'white',
  title: 'search',
};

SearchAll.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  sqon: PropTypes.object.isRequired,
  color: PropTypes.string,
  title: PropTypes.string,
};

export default compose(
  withApi,
  withTheme,
)(SearchAll);
