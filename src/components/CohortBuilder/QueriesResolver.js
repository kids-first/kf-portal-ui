import PropTypes from 'prop-types';
import Component from 'react-component-component';
import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import { isEqual, memoize } from 'lodash';
import { print } from 'graphql/language/printer';

class QueriesResolver extends Component {
  state = { data: [], isLoading: true, error: null };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.queries, prevProps.queries)) {
      this.update();
    }
  }

  update = async () => {
    const { queries = [], useCache = true } = this.props;
    const body = JSON.stringify(
      queries.map(q => ({
        query: typeof q.query === 'string' ? q.query : print(q.query),
        variables: q.variables,
      })),
    );

    try {
      if (!useCache) {
        this.setState({ isLoading: true });
      }
      const data = useCache ? await this.memoFetchData(body) : await this.fetchData(body);
      this.setState({ data: data, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false, error: err });
    }
  };

  fetchData = body => {
    const { queries, api, name = '' } = this.props;
    return api({
      method: 'POST',
      url: urlJoin(arrangerApiRoot, `/${arrangerProjectId}/graphql/${name}`),
      body,
    }).then(data =>
      data.map((d, i) => {
        const transform = queries[i].transform;
        return transform ? transform(d) : d;
      }),
    );
  };

  memoFetchData = memoize(this.fetchData);

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
