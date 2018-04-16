import ajax from 'services/ajax';
import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';

const graphql = async body =>
  await ajax.post(urlJoin(arrangerApiRoot, `/${arrangerProjectId}/graphql`), body);

const buildFileQuery = ({ fields, first = null }) => {
  const firstString = first === null ? '' : `, first:${first}`;
  return `query ($sqon: JSON) {file {hits(filters: $sqon${firstString}) {total, edges {node {${fields.reduce(
    (a, b) => a + ' ' + b,
  )}}}}}}`;
};

const getFileTotals = async ({ sqon }) => {
  const body = {
    query: buildFileQuery({ fields: ['id'] }),
    variables: { sqon },
  };
  try {
    const response = await graphql(body);
    return response.data.data.file.hits.total;
  } catch (error) {
    console.warn(error);
  }
};

export const getFilesById = async ({ ids, fields }) => {
  const query = buildFileQuery({ fields, first: ids.length });
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

export const getFilesByQuery = async ({ sqon, fields }) => {
  const first = await getFileTotals({ sqon });

  const query = buildFileQuery({ fields, first });
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
