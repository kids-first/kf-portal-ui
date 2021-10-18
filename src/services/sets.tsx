import { arrangerApiProjectId, kfArrangerApiRoot } from 'common/injectGlobals';
import { initializeApi } from 'services/api';
import graphql from 'services/arranger';
import { ApiConfig } from 'store/apiTypes';
import { SetSourceType, SetSubActionTypes, SetUpdateInputData } from 'store/saveSetTypes';
import { Sqon } from 'store/sqon';

type CreateSetParams = {
  type: string;
  sqon: Sqon;
  path: string;
  sort?: string[];
  tag?: string;
};

export type ArrangerUserSet = {
  id: string;
  size: number;
  tag: string;
};

export const queryBodySets = (nodes: string) => `query($sqon: JSON) {
              sets {
                hits(filters: $sqon, first: 100, sort: [{field: "tag.keyword", order: asc}]) {
                  edges {
                    node {
                      ${nodes}
                    }
                  }
                }
              }
            }`;

const getIdsFromSetId = async (rawId: string) => {
  const response = await graphql(initializeApi())({
    query: queryBodySets('id ids tag setId path'),
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

export const getSetAndParticipantsCountByUser = async (
  api: (config: ApiConfig) => Promise<ArrangerUserSet[]>,
) =>
  api({
    url: `${kfArrangerApiRoot}sets`,
    method: 'GET',
  });

export const createSet = async (
  api: (config: ApiConfig) => Promise<ArrangerUserSet>,
  params: CreateSetParams,
) => {
  const { type, sqon, path, sort, tag } = params;
  return api({
    url: `${kfArrangerApiRoot}sets`,
    method: 'POST',
    body: {
      projectId: arrangerApiProjectId,
      type,
      sqon,
      idField: path,
      sort,
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
  (await Promise.all(setIds.map((id) => getIdsFromSetId(id)))).flat();
