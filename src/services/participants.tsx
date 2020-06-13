import get from 'lodash/get';
import difference from 'lodash/difference';
import graphql from 'services/arranger';
import { Sqon } from 'store/sqon';
import { initializeApi } from 'services/api';

export const familyMemberAndParticipantIds = async (sqon?: Sqon) => {
  const response = await graphql(initializeApi())({
    query: `
        query familyMemberAndParticipantData($sqon: JSON) {
          file {
            aggregations(filters: $sqon) {
              participants__kf_id {
                buckets {
                  doc_count
                  key
                }
              }
              participants__family__family_compositions__family_members__kf_id {
                buckets {
                  doc_count
                  key
                }
              }
            }
          }
        }
      `,
    variables: { sqon },
  });

  const extractResults = (path: string) => get(response, path, []).map((b: any) => b.key);

  const getFamilyMembersIds = () =>
    extractResults(
      'data.file.aggregations.' +
        'participants__family__family_compositions__family_members__kf_id.buckets',
    );

  const getParticipantsIds = () =>
    extractResults('data.file.aggregations.participants__kf_id.buckets');

  const getFamMembersWithoutPtIds = () => difference(getFamilyMembersIds(), getParticipantsIds());

  return {
    getFamilyMembersIds,
    getParticipantsIds,
    getFamMembersWithoutPtIds,
  };
};

export const resolvePtIdToKfId = async (rawId: string, size = 1) => {
  const response = await graphql(initializeApi())({
    query: `
        query ($sqon: JSON, $size: Int) {
          participant {
            hits(filters: $sqon, first: $size) {
              edges {
                node {
                  external_id
                  kf_id
                }
              }
            }
          }
        }
      `,
    variables: {
      size,
      sqon: {
        op: 'or',
        content: [
          { op: 'in', content: { field: 'kf_id', value: [rawId] } },
          { op: 'in', content: { field: 'external_id', value: [rawId] } },
        ],
      },
    },
  });
  const firstEdge = (response?.data?.participant?.hits?.edges || [])[0];
  return firstEdge?.node?.kf_id;
};
