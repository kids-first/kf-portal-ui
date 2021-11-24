import React from 'react';
import SearchIcon from 'react-icons/lib/fa/search';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';
import { Spin } from 'antd';
import autobind from 'auto-bind-es5';
import Downshift from 'downshift';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import mapKeys from 'lodash/mapKeys';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { arrangerProjectId } from 'common/injectGlobals';
import Filter from 'components/CohortBuilder/Categories/Filter';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from 'components/CohortBuilder/common';
import QueriesResolver from 'components/CohortBuilder/QueriesResolver';
import { searchAllQueries } from 'components/CohortBuilder/SearchAll/queries';
import QueryResults from 'components/CohortBuilder/SearchAll/QueryResults';
import { SQONdiff } from 'components/Utils';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import { sqonShape } from 'shapes';
import Column from 'uikit/Column';

import './SearchAll.css';

const trackCohortBuilderAction = ({ action, label, category }) => {
  trackUserInteraction({
    category: category || TRACKING_EVENTS.categories.cohortBuilder._cohortBuilder,
    action,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label }),
  });
};

const toGqlFieldPath = (fieldPath) => fieldPath.replace(/\./g, '__');

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

const filterFields = (query, detailedFields) =>
  detailedFields
    .map((field) => {
      const matchByDisplayName = field.displayName.toLowerCase().indexOf(query.toLowerCase()) > -1;
      const filteredBuckets = field.buckets.filter(
        ({ key }) => key.toLowerCase().indexOf(query.toLowerCase()) > -1,
      );
      return {
        ...field,
        matchByDisplayName,
        buckets: filteredBuckets,
      };
    })
    .filter((field) => field.matchByDisplayName || field.buckets.length > 0);

const orderFields = memoizeOne((fields, aggFieldsValues) =>
  fields.map((fieldName) => aggFieldsValues[toGqlFieldPath(fieldName)]),
);

const getFilteredFields = memoizeOne((query, fields, aggFieldsValues) => {
  const orderedFields = orderFields(fields, aggFieldsValues);
  return filterFields(query, orderedFields);
});

const DISPLAY_MODE = {
  CLOSED: 'CLOSED',
  RESULTS: 'RESULTS',
  FILTER: 'FILTER',
};

const N_OF_CHARS_BEFORE_SEARCHING = 2;

class SearchAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      debouncedQuery: '',
      fieldName: '',
      selections: initializeSelection(props.fields, props.sqon),
      displayMode: DISPLAY_MODE.CLOSED,
    };
    autobind(this);
    this.setQueryDebounced = debounce(this.setQueryDebounced, 200);
  }

  static propTypes = {
    title: PropTypes.string,
    sqon: sqonShape.isRequired,
    onSqonUpdate: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    color: PropTypes.string,
    api: PropTypes.func.isRequired,
  };

  static defaultProps = {
    color: 'white',
    title: 'search',
  };

  close() {
    this.setState({
      query: '',
      debouncedQuery: '',
      fieldName: '',
      displayMode: DISPLAY_MODE.CLOSED,
      isFilterShown: false,
      selections: {},
    });
  }

  setQuery(query) {
    const { displayMode } = this.state;
    const { fields, sqon } = this.props;
    const selections =
      displayMode !== DISPLAY_MODE.CLOSED && query.length > 0
        ? initializeSelection(fields, sqon)
        : this.state.selections;

    this.setState({
      query,
      displayMode: query === '' ? DISPLAY_MODE.CLOSED : DISPLAY_MODE.RESULTS,
      selections,
    });

    this.setQueryDebounced({
      debouncedQuery: query,
      displayMode: query === '' ? DISPLAY_MODE.CLOSED : DISPLAY_MODE.RESULTS,
    });
  }

  setQueryDebounced(state) {
    this.setState(state);

    trackCohortBuilderAction({
      category: `${TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters} - Search All`,
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
      category: `${TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters} - Search All`,
      action: TRACKING_EVENTS.actions.clear,
      label: debouncedQuery,
    });
  }

  renderSearchResults(isLoading, data, selections) {
    const { fields } = this.props;
    const { debouncedQuery } = this.state;

    // filter both the fields and their buckets
    //  to keep only the field values matching the query
    const canStartSearch = debouncedQuery && debouncedQuery.length >= N_OF_CHARS_BEFORE_SEARCHING;
    if (!canStartSearch) {
      return null;
    }

    return (
      <QueryResults
        query={debouncedQuery}
        isLoading={isLoading}
        filteredFields={getFilteredFields(debouncedQuery, fields, data[0])}
        selections={selections}
        onSelectionChange={this.handleSelectionChange}
        onApplyFilter={this.handleApplyFilter}
        onClearQuery={this.handleClearQuery}
        onSearchField={this.handleSearchByField}
      />
    );
  }

  renderFilter() {
    const { sqon, onSqonUpdate } = this.props;
    const { fieldName } = this.state;

    return (
      <div className="results-container open">
        <Filter
          initialSqon={sqon}
          onSubmit={(sqon) => {
            onSqonUpdate(fieldName, sqon);
            this.close();
          }}
          onBack={() => {
            this.close();
          }}
          onCancel={() => {
            this.close();
          }}
          field={fieldName}
          arrangerProjectId={arrangerProjectId}
          arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        />
      </div>
    );
  }

  renderOverlay(isLoading, data) {
    const { selections, displayMode } = this.state;

    switch (displayMode) {
      case DISPLAY_MODE.CLOSED:
        return null;
      case DISPLAY_MODE.RESULTS:
        return this.renderSearchResults(isLoading, data, selections);
      case DISPLAY_MODE.FILTER:
        return this.renderFilter();
      default:
        console.warn(`[SearchAll] Unhandled display mode ${displayMode}`);
        return null;
    }
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

    let keyedBuckets = mapKeys(field.buckets, (v) => v.value);
    let bucket = field.buckets[Object.keys(keyedBuckets).indexOf(value)];
    const { displayName, name } = field;

    trackCohortBuilderAction({
      category: `${TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters} - Search All`,
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
    const { selections, fieldName } = this.state;

    const newSqonPerField = fields
      .filter((field) => selections[field].length > 0)
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
        .filter((op) => op.op !== OP_TO_USE || !selections[op.content.field])
        .concat(newSqonPerField),
    };

    onSqonUpdate(fieldName, newSqon);

    this.close();
    /**
     * tracks both the added SQON and the final result/composite sqon
     * after the new filters are applied
     */
    trackCohortBuilderAction({
      category: `${TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters} - Search All`,
      action: `${TRACKING_EVENTS.actions.apply} Selected Filters`,
      label: { added_sqon: SQONdiff(newSqon, sqon), result_sqon: newSqon },
    });
  }

  handleSearchByField(fieldName) {
    this.setState({
      query: '',
      debouncedQuery: '',
      displayMode: DISPLAY_MODE.FILTER,
      fieldName,
      isFilterShown: false,
      selections: {},
    });
  }

  render() {
    const { api, sqon, color, title, fields } = this.props;
    const { query, displayMode } = this.state;

    return (
      // Extract the metadata & data fetching to a component
      <ExtendedMappingProvider
        api={api}
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        useCache={true}
      >
        {({ loading: extendedMappingIsLoading, extendedMapping = [] }) => (
          <QueriesResolver
            name="GQL_SEARCH_ALL_FACETS"
            api={api}
            sqon={sqon}
            queries={searchAllQueries(sqon, fields, extendedMapping || [])}
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
                return <Spin />;
              }

              return (
                <Downshift
                  isOpen={displayMode !== DISPLAY_MODE.CLOSED}
                  onOuterClick={() => this.close()}
                >
                  {({ getRootProps }) => (
                    <div
                      className="search-all-filter"
                      // TODO : REMOVE ref stuff?
                      {...getRootProps({ refKey: 'ref' }, { suppressRefError: true })}
                    >
                      <Column
                        className="query-container"
                        style={{ borderTop: `4px solid ${color}` }}
                      >
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
                      </Column>
                      {this.renderOverlay(isLoading, data)}
                    </div>
                  )}
                </Downshift>
              );
            }}
          </QueriesResolver>
        )}
      </ExtendedMappingProvider>
    );
  }
}

export default compose(withApi)(SearchAll);
