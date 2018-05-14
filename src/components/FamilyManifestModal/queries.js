import { get, difference } from 'lodash';
import graphql from 'services/arranger';

export const participantsFilesCountAndSize = async ({ api, sqon }) => {
  const response = await graphql(api)({
    query: `
        query familyMemberAndParticipantData($sqon: JSON, $include_missing: Boolean) {
          file {

            hits(filters: $sqon) {
              total
            }

            aggregations(filters: $sqon, include_missing: $include_missing) {
              size {
                stats {
                  sum
                }
              }
            }

          }
        }
      `,
    variables: { sqon, include_missing: true },
  });

  const { data } = response;

  const participantFilesCount = get(data, 'file.hits.total') || 0;
  const participantFilesSize = get(data, 'file.aggregations.size.stats.sum') || 0;

  return { participantFilesCount, participantFilesSize };
};

export const familyMemberAndParticipantIds = async ({ api, sqon }) => {
  const response = await graphql(api)({
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
  const extractResults = path => get(response, path, []).map(b => b.key);
  const familyMemberIds = extractResults(
    'data.file.aggregations.participants__family__family_compositions__family_members__kf_id.buckets',
  );
  const participantIds = extractResults('data.file.aggregations.participants__kf_id.buckets');
  return {
    familyMemberIds,
    participantIds,
    familyMembersWithoutParticipantIds: difference(familyMemberIds, participantIds),
  };
};

export const dataTypesFromFamilyMemberIds = async ({ api, familyMemberIds }) => {
  const response = await graphql(api)({
    query: `
        query dataTypes($sqon: JSON) {
          file {
            aggregations(filters: $sqon) {
              data_type {
                buckets {
                  doc_count
                  key
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
            content: {
              field: 'participants.kf_id',
              value: familyMemberIds,
            },
          },
        ],
      },
    },
  });
  return get(response, 'data.file.aggregations.data_type.buckets', []);
};

export const generateFamilyManifestModalProps = async ({ api, sqon }) => {
  const {
    familyMemberIds,
    participantIds,
    familyMembersWithoutParticipantIds,
  } = await familyMemberAndParticipantIds({ api, sqon });
  const dataTypes = await dataTypesFromFamilyMemberIds({
    api,
    familyMemberIds: familyMembersWithoutParticipantIds,
  });
  const { participantFilesCount, participantFilesSize } = await participantsFilesCountAndSize({
    api,
    sqon,
  });
  return {
    familyMemberIds,
    participantIds,
    familyMembersWithoutParticipantIds,
    dataTypes,
    participantFilesCount,
    participantFilesSize,
  };
};
