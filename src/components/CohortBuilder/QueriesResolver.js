import React from 'react';
import PropTypes from 'prop-types';
import tq from 'task-queue';
import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import { isEqual } from 'lodash';
import { print } from 'graphql/language/printer';
import stringify from 'json-stringify-deterministic';

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
  state = { data: [], isLoading: true, error: null };
  taskQueue = tq.Queue({ capacity: 100, concurrency: 1 });

  componentDidMount() {
    this.taskQueue.start();
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.queries, prevProps.queries)) {
      this.update();
    }
  }

  update = () => {
    const { queries = [], useCache = true } = this.props;
    return queries.length !== 0
      ? this.taskQueue.enqueue(
          () =>
            new Promise(async resolve => {
              const body = stringify(
                queries.map(q => ({
                  query: typeof q.query === 'string' ? q.query : print(q.query),
                  variables: q.variables,
                })),
              );
              try {
                if (!useCache) {
                  this.setState({ isLoading: true });
                }
                const data = useCache
                  ? await this.cachedFetchData(body)
                  : await this.fetchData(body);
                this.setState({ data: data, isLoading: false }, resolve);
              } catch (err) {
                this.setState({ isLoading: false, error: err }, resolve);
              }
            }),
        )
      : null;
  };

  fetchData = body => {
    const { queries, api, name = '' } = this.props;
    queryCacheMap[body] = api({
      method: 'POST',
      url: urlJoin(arrangerApiRoot, `/${arrangerProjectId}/graphql/${name}`),
      body,
    }).then(data =>
      data.map((d, i) => {
        const transform = queries[i].transform;
        return transform ? transform(d) : d;
      }),
    );
    return queryCacheMap[body];
  };

  cachedFetchData = body => queryCacheMap[body] || this.fetchData(body);

  render() {
    return this.props.children({ ...this.state });
  }
}

export default QueriesResolver;

QueriesResolver.propTypes = {
  api: PropTypes.func.isRequired,
  useCache: PropTypes.bool,
  name: PropTypes.string,
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      query: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
      variables: PropTypes.object.isRequired,
      transform: PropTypes.func,
    }),
  ).isRequired,
};
