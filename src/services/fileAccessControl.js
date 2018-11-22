// @ts-check
import { getUser as getGen3User, getStudyIds } from 'services/gen3';
import { graphql } from 'services/arranger';

const getStudyIdsFromSqon = api => ({ sqon }) =>
  graphql(api)({
    query: `
      query StudyIds($sqon: JSON) {
        file {
          aggregations (filters: $sqon, aggregations_filter_themselves: true){
            participants__study__external_id {
              buckets {
                key
              }
            }
          }
        }
      }
    `,
    variables: {
      sqon,
    },
  }).then(
    ({
      data: {
        file: {
          aggregations: {
            participants__study__external_id: { buckets },
          },
        },
      },
    }) => buckets.map(({ key }) => key),
  );

const getStudiesAggregationsFromSqon = api => studyIds => sqons =>
  !studyIds.length
    ? []
    : graphql(api)({
        query: `
          query AcceptedStudiesAggs(${studyIds.map(id => `$${id}_sqon: JSON`)}) {
            file {
              ${studyIds
                .map(
                  id => `
                  ${id}: aggregations (filters: $${id}_sqon, aggregations_filter_themselves: true){
                    latest_did { buckets { key } }
                    participants__study__name { buckets { key } }
                    participants__study__short_name { buckets { key } }
                  }
                `,
                )
                .join('')}
            }
          }
        `,
        variables: sqons,
      }).then(({ data: { file: aggregations } }) => {
        return studyIds.map(id => {
          const aggregation = aggregations[id];
          const {
            latest_did: { buckets: fileIds },
          } = aggregation;
          const {
            participants__study__name: { buckets: studyNames },
            participants__study__short_name: { buckets: studyShortNames },
          } = aggregation;
          return {
            id: id,
            files: fileIds,
            studyName: studyNames.map(({ key }) => key)[0],
            studyShortName: studyShortNames.map(({ key }) => key)[0],
          };
        });
      });

export const getUserStudyPermission = api => async ({
  sqon = {
    op: 'and',
    content: [],
  },
} = {}) => {
  const userDetails = await getGen3User(api);
  const approvedAcls = Object.keys(userDetails.projects).sort();

  const [acceptedStudyIds, unacceptedStudyIds] = await Promise.all([
    getStudyIdsFromSqon(api)({
      sqon: {
        op: 'and',
        content: [
          ...sqon.content,
          {
            op: 'in',
            content: {
              field: 'acl',
              value: approvedAcls,
            },
          },
        ],
      },
    }),
    getStudyIdsFromSqon(api)({
      sqon: {
        op: 'and',
        content: [
          ...sqon.content,
          {
            op: 'not',
            content: [
              {
                op: 'in',
                content: {
                  field: 'acl',
                  value: approvedAcls,
                },
              },
            ],
          },
        ],
      },
    }),
  ]);

  const [acceptedStudiesAggs, unacceptedStudiesAggs] = await Promise.all([
    getStudiesAggregationsFromSqon(api)(acceptedStudyIds)(
      acceptedStudyIds.reduce((acc, id) => {
        acc[`${id}_sqon`] = {
          op: 'and',
          content: [
            ...sqon.content,
            {
              op: 'in',
              content: {
                field: 'acl',
                value: approvedAcls,
              },
            },
            {
              op: 'in',
              content: {
                field: 'participants.study.external_id',
                value: [id],
              },
            },
          ],
        };
        return acc;
      }, {}),
    ),
    getStudiesAggregationsFromSqon(api)(unacceptedStudyIds)(
      unacceptedStudyIds.reduce((acc, id) => {
        acc[`${id}_sqon`] = {
          op: 'and',
          content: [
            ...sqon.content,
            {
              op: 'not',
              content: [
                {
                  op: 'in',
                  content: {
                    field: 'acl',
                    value: approvedAcls,
                  },
                },
              ],
            },
            {
              op: 'in',
              content: {
                field: 'participants.study.external_id',
                value: [id],
              },
            },
          ],
        };
        return acc;
      }, {}),
    ),
  ]);

  return { acceptedStudiesAggs, unacceptedStudiesAggs };
};
