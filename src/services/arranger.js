import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';

export const api = ({ endpoint = '', body, headers }) =>
  fetch(urlJoin(arrangerApiRoot, endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  })
    .then(r => {
      console.log('arranger response: ' + r);
      return r.json();
    })
    .catch(error => {
      console.warn(error);
    });

const graphql = options => {
  return api({
    endpoint: `/${arrangerProjectId}/graphql`,
    body: options.body,
  });
};

export const getFilesById = async ({ ids, fields }) => {
  const query = `query ($sqon: JSON) {file {hits(filters: $sqon, first:${
    ids.length
  }) {edges {node {${fields.reduce((a, b) => a + ' ' + b)}}}}}}`;
  const sqon = {
    op: 'and',
    content: [{ op: 'in', content: { field: '_id', value: ids } }],
  };
  const body = { query, variables: { sqon } };

  let edges;
  try {
    const response = await graphql({ body });
    edges = response.data.file.hits.edges;
  } catch (error) {
    console.warn(error);
  }
  return edges;
};

export default graphql;
