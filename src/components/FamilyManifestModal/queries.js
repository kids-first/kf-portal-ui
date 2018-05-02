import { get, difference } from 'lodash';
import graphql from 'services/arranger';

export const familyMemberAndParticipantDataQuery = api => ({ sqon }) =>
  graphql(api)({
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
            participants__family__family_members__kf_id {
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

export const dataTypeDataQuery = api => ({ familyMemberIds }) =>
  graphql(api)({
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

export const generateFamilyManifestModalProps = async ({ api, projectId, sqon }) => {
  // familyMembers and participants
  const participantAndFamilyMemberIdsAggregation = await familyMemberAndParticipantDataQuery(api)({
    sqon,
  });
  const familyMemberIds = (
    get(
      participantAndFamilyMemberIdsAggregation,
      'data.file.aggregations.participants__family__family_members__kf_id.buckets',
    ) || []
  ).map(b => b.key);
  const participantIds = (
    get(
      participantAndFamilyMemberIdsAggregation,
      'data.file.aggregations.participants__kf_id.buckets',
    ) || []
  ).map(b => b.key);
  const familyMembersWithoutParticipantIds = difference(familyMemberIds, participantIds);

  // data types
  const dataTypesAggregation = await dataTypeDataQuery(api)({
    familyMemberIds: familyMembersWithoutParticipantIds,
  });
  const dataTypes = get(dataTypesAggregation, 'data.file.aggregations.data_type.buckets') || [];

  return {
    familyMemberIds,
    participantIds,
    dataTypes,
  };
};
