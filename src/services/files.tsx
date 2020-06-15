import graphql from 'services/arranger';
import { initializeApi } from 'services/api';

export const resolveFileIdToKfId = async (rawId: string) => {
  const response = await graphql(initializeApi())({
    query: `
     query ($sqon: JSON) {
        file {
          hits(filters: $sqon) {
            total
            edges {
              node {
                primaryKey: kf_id
                external_id: external_id
                file_name: file_name
                kf_id: kf_id
              }
            }
          }
        }
      }
      `,
    variables: {
      sqon: {
        op: 'or',
        content: [
          {
            op: 'filter',
            content: {
              value: rawId,
              fields: ['external_id', 'file_name', 'kf_id', 'latest_did'],
            },
          },
        ],
      },
    },
  });

  const firstEdge = (response?.data?.file?.hits?.edges || [])[0];
  return firstEdge?.node?.kf_id;
};
