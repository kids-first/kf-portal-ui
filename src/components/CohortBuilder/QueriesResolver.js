import React from 'react';
import { print } from 'graphql/language/printer';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import urlJoin from 'url-join';

import { arrangerApiProjectId, kfArrangerApiRoot } from 'common/injectGlobals';

/**
 * NOTE: this component pulls from a singleton queryCacheMap for its caching,
 * so every instantiation of this component access the same global cache.
 * This allows caching to persist throughout application lifecycle, but limits
 * the use of this component to only read-only data that are not expected to
 * change, which is enough for the usecase in CohortBuilder.
 * If future requirement changes, queryCacheMap can be replaced with a hook in
 * a global state store for better abstraction; but at that point, a full blown
 * Graphql client such as Apollo might be a better consideration.
 */
const queryCacheMap = {};
class QueriesResolver extends React.Component {
  static defaultProps = {
    switchLoadingState: false,
    useCache: true,
    name: 'GQL_QUERIES_RESOLVER',
    queries: [],
  };
  state = { data: [], isLoading: true, error: null };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.queries, prevProps.queries)) {
      this.update();
    }
  }

  // The updateCount is incremented with every update
  // Checking the updateCount before setting the updated data into state
  // prevents a slow running query loading over a more recent query
  updateCount = 0;
  update = async () => {
    const { queries, useCache, switchLoadingState } = this.props;
    const checkCount = ++this.updateCount;
    if (queries.length) {
      const body = JSON.stringify(
        queries.map((q) => ({
          query: typeof q.query === 'string' ? q.query : print(q.query),
          projectId: arrangerApiProjectId,
          variables: q.variables,
        })),
      );
      try {
        if (switchLoadingState) {
          this.setState({ isLoading: true });
        }
        const data = useCache ? await this.cachedFetchData(body) : await this.fetchData(body);
        if (this.updateCount === checkCount) {
          this.setState({ data: data, isLoading: false });
        }
      } catch (err) {
        if (this.updateCount === checkCount) {
          this.setState({ isLoading: false, error: err });
        }
      }
    } else {
      this.setState({ isLoading: false, data: [] });
    }
  };

  fetchData = (body) => {
    const { queries, api } = this.props;
    queryCacheMap[body] = api({
      method: 'POST',
      url: urlJoin(kfArrangerApiRoot, `/search`),
      body,
    }).then((data) =>
      data.map((d, i) => {
        const transform = queries[i].transform;
        return transform ? transform(d) : d;
      }),
    );
    return queryCacheMap[body];
  };

  cachedFetchData = (body) => queryCacheMap[body] || this.fetchData(body);

  render() {
    return this.props.children({ ...this.state });
  }
}

export default QueriesResolver;

QueriesResolver.propTypes = {
  switchLoadingState: PropTypes.bool,
  api: PropTypes.func.isRequired,
  useCache: PropTypes.bool,
  name: PropTypes.string,
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      query: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
      variables: PropTypes.object,
      projectId: PropTypes.string,
      transform: PropTypes.func,
    }),
  ).isRequired,
};
