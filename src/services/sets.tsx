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

export const fetchPtIdsFromSaveSets = async (setIds: string[]) =>
  (await Promise.all(setIds.map((id) => getIdsFromSaveSetId(id)))).flat();
