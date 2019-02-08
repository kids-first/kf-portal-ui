import React from 'react';
import PropTypes from 'prop-types';
import Component from 'react-component-component';
import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import { isEqual } from 'lodash';

class QueriesResolver extends Component {
  state = { data: null, isLoading: true, error: null };

  componentDidMount() {
    this.fetchQuery();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.queries, prevProps.queries)) {
      this.fetchQuery();
    }
  }

  fetchQuery = () => {
    const { queries, api } = this.props;

    const body = JSON.stringify(
      queries.map(q => ({
        query: q.query,
        variables: q.variables,
      })),
    );

    api({
      method: 'POST',
      url: urlJoin(arrangerApiRoot, `/${arrangerProjectId}/graphql`),
      body,
    })
      .then(data =>
        data.map((d, i) => {
          const transform = queries[i].transform;
          return transform ? transform(d) : d;
        }),
      )
      .then(data => this.setState({ data: data, isLoading: false }))
      .catch(err => this.setState({ isLoading: false, error: err }));
  };

  render() {
    return <div>{this.props.children({ ...this.state, ...this.props })}</div>;
  }
}

export default QueriesResolver;

QueriesResolver.propTypes = {
  api: PropTypes.isRequired,
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      query: PropTypes.string.isRequired,
      variables: PropTypes.isRequired,
      transform: PropTypes.func,
    }),
  ).isRequired,
};
