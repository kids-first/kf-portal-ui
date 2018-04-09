import ajax from 'services/ajax';
import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';

const graphql = async body =>
  await ajax.post(urlJoin(arrangerApiRoot, `/${arrangerProjectId}/graphql`), body);

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
    const response = await graphql(body);
    edges = response.data.data.file.hits.edges;
  } catch (error) {
    console.warn(error);
  }
  return edges;
};

export default graphql;
