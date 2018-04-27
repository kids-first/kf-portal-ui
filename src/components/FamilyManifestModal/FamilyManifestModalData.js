import { get, difference } from 'lodash';
import { compose, withProps } from 'recompose';
import { injectState } from 'freactal/lib/inject';

import { withQuery } from '@arranger/components';

export const familyMemberAndParticipantDataQueryBody = ({ sqon }) => ({
  query: `
    query dataTypes($sqon: JSON) {
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

export const dataTypeDataQueryBody = ({ familyMemberIds }) => ({
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

export const sqonForDownload = ({ values, familyMemberIds, sqon }) => {
  const selectedDataTypes = Object.entries(values)
    .filter(([, val]) => val)
    .map(([key]) => key);
  return sqon
    ? {
        op: 'or',
        content: [
          sqon,
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'data_type', value: selectedDataTypes },
              },
              {
                op: 'in',
                content: { field: 'participants.kf_id', value: familyMemberIds },
              },
            ],
          },
        ],
      }
    : sqon;
};

const enhance = compose(
  injectState,

  withQuery(({ sqon, projectId, familyMemberIdAggregation }) => ({
    renderError: true,
    projectId,
    key: 'participantAndFamilyMemberIdsAggregation',
    ...familyMemberAndParticipantDataQueryBody({ sqon }),
  })),
  withProps(({ participantAndFamilyMemberIdsAggregation: { data } }) => {
    const familyMemberIds = (
      get(data, 'file.aggregations.participants__family__family_members__kf_id.buckets') || []
    ).map(b => b.key);
    const participantIds = (get(data, 'file.aggregations.participants__kf_id.buckets') || []).map(
      b => b.key,
    );
    return {
      familyMemberIds,
      participantIds,
      familyMembersWithoutParticipantIds: difference(familyMemberIds, participantIds),
    };
  }),

  withQuery(
    ({
      sqon,
      projectId,
      participantAndFamilyMemberIdsAggregation,
      familyMembersWithoutParticipantIds,
    }) => {
      return {
        shouldFetch: !participantAndFamilyMemberIdsAggregation.loading,
        renderError: true,
        projectId,
        key: 'dataTypesAggregation',
        ...dataTypeDataQueryBody({ familyMemberIds: familyMembersWithoutParticipantIds }),
      };
    },
  ),
  withProps(({ dataTypesAggregation: { data } }) => ({
    dataTypes: get(data, 'file.aggregations.data_type.buckets') || [],
  })),
);

export const generateFamilyManifestModalProps = async ({ api, projectId, sqon }) => {
  const fetcher = ({ body }) =>
    api({
      endpoint: `${projectId}/graphql`,
      body,
    });

  // familyMembers and participants
  const participantAndFamilyMemberIdsAggregation = await fetcher({
    body: familyMemberAndParticipantDataQueryBody({ sqon }),
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
  const dataTypesAggregation = await fetcher({
    body: dataTypeDataQueryBody({ familyMemberIds: familyMembersWithoutParticipantIds }),
  });

  const dataTypes = get(dataTypesAggregation, 'data.file.aggregations.data_type.buckets') || [];

  return {
    participantAndFamilyMemberIdsAggregation: { loading: false, data: {} },
    dataTypesAggregation: { loading: false, data: {} },
    familyMemberIds,
    participantIds,
    dataTypes,
  };
};

export default enhance;
