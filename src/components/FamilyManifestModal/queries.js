import get from 'lodash/get';
import difference from 'lodash/difference';
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
  return {
    participantFilesCount: get(response, 'data.file.hits.total') || 0,
    participantFilesSize: get(response, 'data.file.aggregations.size.stats.sum') || 0,
  };
};

export const familyMemberAndParticipantIds = async ({ api, sqon, isFileRepo }) => {
  const response = await graphql(api)({
    query: isFileRepo
      ? `
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
      `
      : `
      query familyMemberAndParticipantData($sqon: JSON) {
        participant {
          aggregations(filters: $sqon, aggregations_filter_themselves: true) {
            kf_id {
              buckets {
                doc_count
                key
              }
            }
            family__family_compositions__family_members__kf_id {
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
    isFileRepo
      ? 'data.file.aggregations.participants__family__family_compositions__family_members__kf_id.buckets'
      : 'data.participant.aggregations.family__family_compositions__family_members__kf_id.buckets',
  );
  const participantIds = extractResults(
    isFileRepo
      ? 'data.file.aggregations.participants__kf_id.buckets'
      : 'data.participant.aggregations.kf_id.buckets',
  );
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
  const [
    { familyMemberIds, participantIds, familyMembersWithoutParticipantIds },
    { participantFilesCount, participantFilesSize },
  ] = await Promise.all([
    familyMemberAndParticipantIds({ api, sqon }),
    participantsFilesCountAndSize({
      api,
      sqon,
    }),
  ]);
  const dataTypes = await dataTypesFromFamilyMemberIds({
    api,
    familyMemberIds: familyMembersWithoutParticipantIds,
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
