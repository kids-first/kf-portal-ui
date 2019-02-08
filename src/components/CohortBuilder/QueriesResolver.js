import React from 'react';
import PropTypes from 'prop-types';
import Component from 'react-component-component';
import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import { isEqual, memoize } from 'lodash';

class QueriesResolver extends Component {
  state = { data: null, isLoading: true, error: null };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.queries, prevProps.queries)) {
      this.update();
    }
  }

  update = async () => {
    this.setState({ isLoading: true });
    const { queries, useCache = true } = this.props;
    const body = JSON.stringify(
      queries.map(q => ({
        query: q.query,
        variables: q.variables,
      })),
    );
    try {
      const data = useCache ? await this.memoFetchData(body) : await this.fetchData(body);
      this.setState({ data: data, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false, error: err });
    }
  };

  fetchData = body => {
    const { queries, api } = this.props;
    return api({
      method: 'POST',
      url: urlJoin(arrangerApiRoot, `/${arrangerProjectId}/graphql`),
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
<<<<<<< HEAD
    return this.props.children({ ...this.state, ...this.props });
=======
    return <div>{this.props.children({ ...this.state, ...this.props })}</div>;
>>>>>>> change QueryResolver to class
  }
}

export default QueriesResolver;

QueriesResolver.propTypes = {
  api: PropTypes.isRequired,
  useCache: PropTypes.boolean,
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      query: PropTypes.string.isRequired,
      variables: PropTypes.isRequired,
      transform: PropTypes.func,
    }),
  ).isRequired,
};
