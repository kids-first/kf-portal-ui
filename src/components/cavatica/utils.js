import { graphql } from 'services/arranger';
import { toGqlString } from 'services/utils';

export const getStudiesAggregations = ({ api, studies, sqon }) => {
  return !studies.length
    ? []
    : graphql(api)({
        query: `
          query approvedStudyAggs(${studies
            .map(study => `$${toGqlString(study)}_sqon: JSON`)
            .join(' ')}) {
            file {
              ${studies
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
        variables: studies.reduce(
          (acc, study) => ({
            ...acc,
            [`${toGqlString(study)}_sqon`]: {
              ...sqon,
              content: [
                ...sqon.content,
                {
                  op: 'in',
                  content: {
                    field: 'participants.study.external_id',
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
export const getUnapprovedStudiesForFiles = ({ api, files, approvedStudyAggs }) =>
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
        ],
      },
    },
  }).then(
    ({ data: { file: { aggregations: { participants__study__external_id: { buckets } } } } }) =>
      buckets
        .map(({ key }) => key)
        .filter(study => !approvedStudyAggs.map(({ study }) => study).includes(study)),
  );
