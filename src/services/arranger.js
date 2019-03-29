import ajax from 'services/ajax';
import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import { flatten, get } from 'lodash';

export const MISSING_DATA = '__missing__';

export const graphql = (api, queryName = '') => body =>
  api
    ? api({ endpoint: `/${arrangerProjectId}/graphql/${queryName}`, body })
    : ajax.post(urlJoin(arrangerApiRoot, `/${arrangerProjectId}/graphql`), body);

export const arrangerGqlRecompose = (api, queryName = '') => ({ body, ...rest }) =>
  graphql(api, queryName)({ ...body, ...rest });

export const buildFileQuery = ({ fields, first = null }) => {
  const firstString = first === null ? '' : `, first:${first}`;
  return `query ($sqon: JSON) {file {hits(filters: $sqon${firstString}) {total, edges {node {${fields.reduce(
    (a, b) => a + ' ' + b,
  )}}}}}}`;
};

export const buildParticipantQuery = ({ fields, first = null }) => {
  const firstString = first === null ? '' : `, first:${first}`;
  return `query ($sqon: JSON) {participant {hits(filters: $sqon${firstString}) {total, edges {node {${fields.reduce(
    (a, b) => a + ' ' + b,
  )}}}}}}`;
};

const extractHits = data => data.data.file.hits;

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
export default graphql;

export const getParticipantById = async ({ ids, fields, api }) => {
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

export const buildSqonForIds = ids => ({
  op: 'and',
  content: [{ op: 'in', content: { field: '_id', value: ids } }],
});

export const fetchSurvivalData = api => sqon => {
  const body = { project: arrangerProjectId, sqon };
  return api({ endpoint: `/survival`, body }).then(response => {
    const donors = flatten(
      response.data.map(group =>
        group.donors.map(donor => ({
          id: get(donor, 'meta.id', ''),
          time: donor.time,
          survivalEstimate: group.cumulativeSurvival,
          censored: donor.censored,
        })),
      ),
    );
    return { donors };
  });
};
