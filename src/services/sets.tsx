import graphql from 'services/arranger';
import { initializeApi } from 'services/api';
import { SaveSetInfo } from '../components/UserDashboard/ParticipantSets';

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

  return response.data.sets.aggregations.size.stats.count;
};

export const getSetAndParticipantsCountByUser = async (userId: string) => {
  const response = await graphql(initializeApi())({
    query: `query($sqon: JSON) {
              sets {
                hits(filters: $sqon, first: 100, sort: [{field: "tag.keyword", order: asc}]) {
                  edges {
                    node {
                      tag
                      setId
                      size
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
            content: { field: 'userId', value: [userId] },
          },
          {
            op: 'not-in',
            content: { field: 'tag.keyword', value: ['', null] },
          },
        ],
      },
    },
  });

  return response.data.sets.hits.edges;
};

export const deleteSaveSet = async (userId: string, setIds: string[]) => {
  const response = await graphql(initializeApi())({
    query: `mutation ($setIds: [String!] $userId: String!) {
              deleteSaveSets(setIds: $setIds, userId: $userId)
            }`,
    variables: {
      setIds: setIds,
      userId: userId,
    },
  });

  return response.data.deleteSaveSets;
};

export const editSaveSetTag = async (set: SaveSetInfo) => {
  const response = await graphql(initializeApi())({
    query: `mutation($tag: String!, $userId: String!, $setId: String! ){
              renameSaveSetTag(tag: $tag, userId: $userId, setId: $setId)
            }`,
    variables: {
      tag: set.name,
      userId: set.currentUser,
      setId: set.key,
    },
  });

  return response.data.updateSaveSet;
};

export const fetchPtIdsFromSaveSets = async (setIds: string[]) =>
  (await Promise.all(setIds.map((id) => getIdsFromSaveSetId(id)))).flat();

export const saveNewSet = async (setName: string, userId: string) =>
  saveSetCountForTag(setName, userId);
