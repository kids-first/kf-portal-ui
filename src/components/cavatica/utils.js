import { graphql } from 'services/arranger';
import { toGqlString } from 'services/utils';

export const getStudiesAggregations = ({ api, acls, sqon }) => {
  return !acls.length
    ? []
    : graphql(api)({
        query: `
          query approvedStudyAggs(${acls
            .map(study => `$${toGqlString(study)}_sqon: JSON`)
            .join(' ')}) {
            file {
              ${acls
                .map(
                  study => `
                  ${toGqlString(study)}: aggregations (filters: $${toGqlString(study)}_sqon){
                    latest_did {
                      buckets {
                        key
                      }
                    }
                    participants__study__name {
                      buckets {
                        key
                      }
                    }
                  }
                `,
                )
                .join(' ')}
            }
          }
        `,
        variables: acls.reduce(
          (acc, study) => ({
            ...acc,
            [`${toGqlString(study)}_sqon`]: {
              ...sqon,
              content: [
                ...sqon.content,
                {
                  op: 'in',
                  content: {
                    field: 'acl',
                    value: study,
                  },
                },
              ],
            },
          }),
          {},
        ),
      }).then(({ data: { file: fileAggs } }) =>
        Object.entries(fileAggs).map(([study, aggs]) => ({
          study: study,
          files: aggs.latest_did.buckets.map(({ key }) => key),
          studyName: aggs.participants__study__name.buckets.length
            ? aggs.participants__study__name.buckets[0].key
            : null,
        })),
      );
};
export const getUnapprovedStudiesForFiles = ({ api, files, approvedStudyAggs, acl = [] }) =>
  graphql(api)({
    query: `
      query ($sqon: JSON) {
        file {
          aggregations (filters: $sqon){
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
      sqon: {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: '_id',
              value: files,
            },
          },
          {
            op: 'not',
            content: [
              {
                op: 'in',
                content: {
                  field: 'acl',
                  value: acl,
                },
              },
            ],
          },
        ],
      },
    },
  }).then(
    ({ data: { file: { aggregations: { participants__study__external_id: { buckets } } } } }) =>
      buckets.map(({ key }) => key),
  );
