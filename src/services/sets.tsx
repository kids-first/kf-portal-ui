import graphql from 'services/arranger';
import { initializeApi } from 'services/api';

const getIdsFromSaveSetId = async (rawId: string) => {
  const response = await graphql(initializeApi())({
    query: `
     query ($sqon: JSON) {
        sets {
          hits(filters: $sqon) {
            total
            edges {
              node {
                id
                ids
                tag
                setId
                path
              }
            }
          }
        }
      }
      `,
    variables: {
      sqon: {
        op: 'and',
        content: [
          {
            op: 'in',
            content: { field: 'setId', value: [rawId] },
          },
        ],
      },
    },
  });

  const firstEdge = (response?.data?.sets?.hits?.edges || [])[0];
  return firstEdge?.node?.ids;
};

export const saveSetCountForTag = async (tag: string, userId: string) => {
  const response = await graphql(initializeApi())({
    query: `query($sqon: JSON) {
        sets {
          aggregations(filters: $sqon, aggregations_filter_themselves: false) {
            size {
              stats {
                count
              }
            }
          }
        }
      }`,
    variables: {
      sqon: {
        op: 'and',
        content: [
          {
            op: 'in',
            content: { field: 'tag.keyword', value: [tag] },
          },
          {
            op: 'in',
            content: { field: 'userId', value: [userId] },
          },
        ],
      },
    },
  });
  return response?.data?.sets?.aggregations?.size?.stats?.count || 0;
};

export const fetchPtIdsFromSaveSets = async (setIds: string[]) =>
  (await Promise.all(setIds.map((id) => getIdsFromSaveSetId(id)))).flat();

export const saveNewSet = async (setName: string, userId: string) =>
  saveSetCountForTag(setName, userId);
