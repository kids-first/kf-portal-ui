import graphql from 'services/arranger';
import { initializeApi } from 'services/api';
import { Sqon } from '../store/sqon';
import { SetSourceType, SetSubActionTypes, SetUpdateInputData } from '../store/saveSetTypes';

type CreateSetParams = {
  type: string;
  sqon: Sqon;
  path: string;
  sort?: string[];
  tag?: string;
};

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

export const setCountForTag = async (tag: string, userId: string) => {
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
            content: { field: 'tag.keyword', value: [''] },
          },
          {
            op: 'in',
            content: { field: 'tag.keyword', value: ['__missing_not_wrapped__'] },
          },
        ],
      },
    },
  });

  return response.data.sets.hits.edges;
};

export const createSet = async (userId: string, params: CreateSetParams) => {
  const { type, sqon, path, sort, tag } = params;
  return await graphql(initializeApi())({
    query: `mutation saveSet($type: String! $userId: String $sqon: JSON! 
            $path: String!, $sort: [Sort], $tag: String) {
              saveSet(type: $type, userId: $userId, sqon: $sqon, path: $path, sort: $sort, tag: $tag) {
                setId
                size
               tag
              }
            }`,
    variables: {
      type,
      userId,
      sqon,
      path,
      sort: sort || [],
      tag,
    },
  });
};

export const deleteSets = async (setIds: string[]) => {
  const response = await graphql(initializeApi())({
    query: `mutation ($setIds: [String!]) {
              deleteSets(setIds: $setIds)
            }`,
    variables: {
      setIds: setIds,
    },
  });

  return response.data.deleteSets;
};

export const updateSet = async (
  sourceType: SetSourceType,
  data: SetUpdateInputData,
  subAction: SetSubActionTypes,
  setId: string,
) => {
  const response = await graphql(initializeApi())({
    query: `mutation(
              $source: SetUpdateSource!,
              $data: SetUpdateInputData!,
              $subAction: SetSubActionTypes!,
              $target: SetUpdateTarget!
              ){
              updateSet(source:$source, data: $data, subAction: $subAction, target: $target){
                setSize
                updatedResults
              }
            }`,
    variables: {
      source: {
        sourceType: sourceType,
      },
      data: data,
      subAction: subAction,
      target: {
        setId: setId,
      },
    },
  });

  return response.data.updateSet;
};

export const fetchPtIdsFromSaveSets = async (setIds: string[]) =>
  (await Promise.all(setIds.map((id) => getIdsFromSaveSetId(id)))).flat();

export const saveNewSet = async (setName: string, userId: string) =>
  setCountForTag(setName, userId);
