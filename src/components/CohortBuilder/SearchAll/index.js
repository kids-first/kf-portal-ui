import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import SearchIcon from 'react-icons/lib/fa/search';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import autobind from 'auto-bind-es5';
import memoizeOne from 'memoize-one';
import { debounce, isObject, mapKeys } from 'lodash';
import { SQONdiff } from '../../Utils';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';

import { withApi } from 'services/api';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle';
import Column from 'uikit/Column';
import LoadingSpinner from 'uikit/LoadingSpinner';
import { arrangerProjectId } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';

import QueriesResolver from '../QueriesResolver';
import { searchAllFieldsQuery } from './queries';
import QueryResults from './QueryResults';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import './SearchAll.css';
import Downshift from 'downshift';

const trackCohortBuilderAction = ({ action, label, category }) => {
  trackUserInteraction({
    category: category || TRACKING_EVENTS.categories.cohortBuilder._cohortBuilder,
    action,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label }),
  });
};

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
  width: 100%;

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

const toGqlFieldPath = fieldPath => fieldPath.replace(/\./g, '__');

const OP_TO_USE = 'in';

const initializeSelection = (fields, sqon) => {
  const initialValues = sqon.content.reduce((acc, op) => {
    if (op.op === OP_TO_USE) {
      acc[op.content.field] = op.content.value;
    }
    return acc;
  }, {});

  return fields.reduce((acc, field) => {
    acc[field] = initialValues[field] ? [...initialValues[field]] : [];
    return acc;
  }, {});
};

const filterFields = (query, detailedFields) => {
  return detailedFields
    .map(field => {
      const matchByDisplayName = field.displayName.toLowerCase().indexOf(query.toLowerCase()) > -1;
      const filteredBuckets = field.buckets.filter(
        ({ value }) => value.toLowerCase().indexOf(query.toLowerCase()) > -1,
      );
      return {
        ...field,
        matchByDisplayName,
        buckets: filteredBuckets,
      };
    })
    .filter(field => field.matchByDisplayName || field.buckets.length > 0);
};

const filterExtendedMapping = memoizeOne((fields, extendedMapping) => {
  return (extendedMapping || []).filter(emf => fields.some(field => field === emf.field));
});

const getFieldsDetails = memoizeOne((fields, aggFieldsValues, extendedMapping) => {
  // only keep the fields we're interested in
  const filteredExtendedMapping = filterExtendedMapping(fields, extendedMapping);

  // map the values to an object convenient to the render
  return fields
    .map(fieldName => {
      const aggField = aggFieldsValues[toGqlFieldPath(fieldName)];
      if (!aggField) {
        console.log(`[SearchAll] Field ${fieldName} aggregated data could not be found`);
        return null;
      }

      const fieldExtendedMapping = filteredExtendedMapping.find(fem => fem.field === fieldName);
      if (!fieldExtendedMapping) {
        console.log(`[SearchAll] Field ${fieldName} extended mapping could not be found`);
        return null;
      }

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
});

const getFilteredFields = memoizeOne((query, fields, aggFieldsValues, extendedMapping) => {
  const detailedFields = getFieldsDetails(fields, aggFieldsValues, extendedMapping);
  return filterFields(query, detailedFields);
});

class SearchAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      debouncedQuery: '',
      selections: initializeSelection(props.fields, props.sqon),
      isOpen: false,
    };
    autobind(this);
    this.setQueryDebounced = debounce(this.setQueryDebounced, 200);
  }

  close() {
    this.setState({
      query: '',
      debouncedQuery: '',
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

    this.setQueryDebounced({
      debouncedQuery: query,
      isOpen: query !== '',
    });
  }

  setQueryDebounced(state) {
    this.setState(state);

    trackCohortBuilderAction({
      category: `${
        TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters
      } - Search All`,
      action:
        state.debouncedQuery !== ''
          ? TRACKING_EVENTS.actions.search
          : TRACKING_EVENTS.actions.clear,
      label: state.debouncedQuery,
    });
  }

  handleQueryChange(evt) {
    this.setQuery(evt.currentTarget.value);
  }

  handleClearQuery() {
    const { debouncedQuery } = this.state;

    this.close();

    trackCohortBuilderAction({
      category: `${
        TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters
      } - Search All`,
      action: TRACKING_EVENTS.actions.clear,
      label: debouncedQuery,
    });
  }

  handleSelectionChange(evt, field, value) {
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

    let keyedBuckets = mapKeys(field.buckets, (v, k) => v.value);
    let bucket = field.buckets[Object.keys(keyedBuckets).indexOf(value)];
    const { displayName, name } = field;

    trackCohortBuilderAction({
      category: `${
        TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters
      } - Search All`,
      action: `${TRACKING_EVENTS.actions.filter} Selected`,
      label: {
        type: 'filter',
        field: {
          displayName,
          name,
          bucket,
        },
        value,
      },
    });
  }

  handleApplyFilter() {
    const { sqon, fields, onSqonUpdate } = this.props;
    const { selections } = this.state;

    const newSqonPerField = fields
      .filter(field => selections[field].length > 0)
      .reduce(
        (acc, field) =>
          acc.concat({
            op: OP_TO_USE,
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
        .filter(op => op.op !== OP_TO_USE || !selections[op.content.field])
        .concat(newSqonPerField),
    };

    onSqonUpdate(newSqon);

    this.close();
    /**
     * trakcs both the added SQON and the final result/composite sqon
     * after the new filters are applied
     */
    trackCohortBuilderAction({
      category: `${
        TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters
      } - Search All`,
      action: `${TRACKING_EVENTS.actions.apply} Selected Filters`,
      label: { added_sqon: SQONdiff(newSqon, sqon), result_sqon: newSqon },
    });
  }

  handleSearchByField(fieldName) {
    this.props.onSearchField(fieldName, this.state.selections[fieldName]);
    this.close();
  }

  render() {
    const { api, sqon, color, title, fields, theme } = this.props;
    const { query, debouncedQuery, selections, isOpen } = this.state;

    return (
      // Extract the metadata & data fetching to a component
      <ExtendedMappingProvider
        api={api}
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        useCache={true}
      >
        {({ loading: extendedMappingIsLoading, extendedMapping }) => {
          return (
            <QueriesResolver
              name="GQL_PARTICIPANTS_TABLE"
              api={api}
              sqon={sqon}
              queries={[searchAllFieldsQuery(sqon, fields)]}
            >
              {({ isLoading, data, error }) => {
                if (error) {
                  console.error('[SearchAll] HTTP error encountered', error);
                  return null;
                }

                if (data && data[0] && data[0].errors) {
                  console.error('[SearchAll] server-side error encountered', data[0].errors);
                  return null;
                }

                if (extendedMappingIsLoading || isLoading) {
                  return <LoadingSpinner color={theme.greyScale11} size={'30px'} />;
                }

                // filter both the fields and their buckets
                //  to keep only the field values matching the query
                const filteredFields = debouncedQuery
                  ? getFilteredFields(debouncedQuery, fields, data[0], extendedMapping)
                  : [];

                return (
                  <Downshift isOpen={isOpen} onOuterClick={() => this.setState({ isOpen: false })}>
                    {({ getRootProps, isOpen }) => (
                      <SearchAllContainer
                        className="search-all-filter"
                        {...getRootProps({ refKey: 'innerRef' }, { suppressRefError: true })}
                      >
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
                        {isOpen ? (
                          <QueryResults
                            query={debouncedQuery}
                            isLoading={isLoading}
                            filteredFields={filteredFields}
                            selections={selections}
                            onSelectionChange={this.handleSelectionChange}
                            onApplyFilter={this.handleApplyFilter}
                            onClearQuery={this.handleClearQuery}
                            onSearchField={this.handleSearchByField}
                          />
                        ) : null}
                      </SearchAllContainer>
                    )}
                  </Downshift>
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
  onSearchField: PropTypes.func.isRequired,
  sqon: PropTypes.object.isRequired,
  color: PropTypes.string,
  title: PropTypes.string,
};

export default compose(
  withApi,
  withTheme,
)(SearchAll);
