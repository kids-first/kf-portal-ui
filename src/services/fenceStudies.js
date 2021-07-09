import keys from 'lodash/keys';

import { graphql } from 'services/arranger';

export const getAuthStudiesIdAndCount = async (api, fence, userAcl) => {
  const response = await graphql(api)({
    query: `
            query AuthorizedStudyIdsAndCount($sqon: JSON) {
              file {
                aggregations(filters: $sqon, aggregations_filter_themselves: true){
                  participants__study__external_id{
                    buckets{
                      key
                      doc_count}
                  }
                }
              }
            }
    `,
    variables: {
      sqon: {
        op: 'and',
        content: [
          { op: 'in', content: { field: 'acl', value: userAcl } },
          { op: 'in', content: { field: 'repository', value: fence } },
        ],
      },
    },
  });

  const {
    data: {
      file: {
        aggregations: {
          participants__study__external_id: { buckets },
        },
      },
    },
  } = response;

  return buckets.reduce(
    (obj, { key, doc_count }) => ({ ...obj, [key]: { authorizedFiles: doc_count } }),
    {},
  );
};

export const getStudiesCountByNameAndAcl = async (api, studies, userAcl) => {
  const studyIds = keys(studies);

  const sqons = studyIds.reduce(
    (obj, studyId) => ({
      ...obj,
      [`${studyId}_sqon`]: {
        op: 'in',
        content: { field: 'participants.study.external_id', value: [studyId] },
      },
    }),
    {},
  );

  const response = await graphql(api)({
    query: `
        query StudyCountByNamesAndAcl(${studyIds.map(
          (studyId) => `$${studyId}_sqon: JSON`,
        )}) {          
          file {
            ${studyIds
              .map(
                (studyId) => `
              ${studyId}: aggregations(filters: $${studyId}_sqon, aggregations_filter_themselves: true) {
                acl {
                  buckets {
                    key
                  }
                }
                participants__study__short_name{
                  buckets{
                    key
                    doc_count
                  }
                } 
              }
            `,
              )
              .join('')}

          }
        }
    `,
    variables: sqons,
  });

  const {
    data: { file },
  } = response;
  return studyIds.map((id) => {
    const agg = file[id];
    return {
      acl: agg['acl']['buckets'].map((b) => b.key).filter((a) => userAcl.includes(a)),
      studyShortName: agg['participants__study__short_name']['buckets'][0]['key'],
      totalFiles: agg['participants__study__short_name']['buckets'][0]['doc_count'],
      id,
      authorizedFiles: studies[id]['authorizedFiles'],
    };
  });
};
