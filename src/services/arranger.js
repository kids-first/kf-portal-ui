import urlJoin from 'url-join';

import { initializeApi } from 'services/api';

import { arrangerApiRoot, arrangerProjectId } from '../common/injectGlobals';

export const MISSING_DATA = '__missing__';

export const graphql = (api = initializeApi(), queryName = '') => (body) =>
  api({ endpoint: `/${arrangerProjectId}/graphql/${queryName}`, body });

/**
 * Generates a human readable error message from a error thrown by the `graphql` function.
 * e.g.
 * "400 : Failed to fetch participant with _id "PT_TZASBGW4"\n
 * Cannot query field "ethnicities" on type "participantNode". Did you mean "ethnicity"?\n
 * Cannot query field "external_ids" on type "participantNode". Did you mean "external_id"?\n
 * Cannot query field "family_ids" on type "participantNode". Did you mean "family_id" or "family"?"\n
 * @see https://www.npmjs.com/package/axios#handling-errors
 * @param {Object} err - an error message returned by the `graphql` function
 * @param {String} customMsg - a message appended to the begining of the message
 */
export const getErrorMessageFromResponse = (err, customMsg = '') => {
  if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errors = err.response.data.errors.map((error) => error.message).join('\n');
    const { status, statusText } = err.response;
    return `${status} ${statusText}: ${customMsg}\n${errors}`;
  }

  if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest
    const { status, statusText } = err.request;
    return `${status} ${statusText}: ${customMsg}\nNo response was received`;
  }

  // Plain Error object
  return err.message;
};

export const arrangerGqlRecompose = (api, queryName = '') => ({ body, ...rest }) =>
  graphql(api, queryName)({ ...body, ...rest });

export const buildFileQuery = ({ fields, first = null }) => {
  const firstString = first === null ? '' : `, first:${first}`;
  return `query ($sqon: JSON) {file {hits(filters: $sqon${firstString}) {total, edges {node {${fields.reduce(
    (a, b) => a + ' ' + b,
  )}}}}}}`;
};

const extractHits = (data) => data.file.hits;

const getFileTotals = async ({ sqon, api }) => {
  const body = {
    query: buildFileQuery({ fields: ['id'] }),
    variables: { sqon },
  };
  try {
    const { data } = await graphql(api)(body);
    return extractHits(data).total;
  } catch (error) {
    console.warn(error);
  }
};

export const getFilesById = async ({ ids, fields, api }) => {
  const query = buildFileQuery({ fields, first: ids.length });
  const sqon = {
    op: 'and',
    content: [{ op: 'in', content: { field: '_id', value: ids } }],
  };
  const body = { query, variables: { sqon } };

  let edges;
  try {
    const { data } = await graphql(api)(body);
    edges = extractHits(data).edges;
  } catch (error) {
    console.warn(error);
  }
  return edges;
};

export const getFilesByQuery = async ({ sqon, fields, api }) => {
  const first = await getFileTotals({ sqon });

  const query = buildFileQuery({ fields, first });
  const body = { query, variables: { sqon } };

  let edges;
  try {
    const { data } = await graphql(api)(body);
    edges = extractHits(data).edges;
  } catch (error) {
    console.warn(error);
  }
  return edges;
};

export const fetchPhenotypes = async (data) => {
  const api = initializeApi();
  return api({
    url: urlJoin(arrangerApiRoot, '/phenotypes'),
    body: { ...data, project: arrangerProjectId },
    method: 'POST',
  });
};

export default graphql;

export const buildSqonForIds = (ids) => ({
  op: 'and',
  content: [{ op: 'in', content: { field: '_id', value: ids } }],
});
