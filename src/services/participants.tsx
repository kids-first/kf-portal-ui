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
