import keys from 'lodash/keys';

import { graphql } from 'services/arranger';

export const getAuthStudiesIdAndCount = async (api, fence, userAcl) =>
  graphql(api)({
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
  }).then(
    ({
      data: {
        file: {
          aggregations: {
            participants__study__external_id: { buckets },
          },
        },
      },
    }) =>
      buckets.reduce((obj, { key, doc_count }) => {
        obj[key] = { authorizedFiles: doc_count };
        return obj;
      }, {}),
  );

export const getStudiesCountByNameAndAcl = async (api, studies, userAcl) => {
  const studyIds = keys(studies);

  const sqons = studyIds.reduce((obj, studyId) => {
    obj[`${studyId}_sqon`] = {
      op: 'in',
      content: { field: 'participants.study.external_id', value: [studyId] },
    };
    return obj;
  }, {});

  return graphql(api)({
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
  }).then(({ data: { file } }) =>
    studyIds.map((id) => {
      let study = {};
      const agg = file[id];
      study['acl'] = agg['acl']['buckets'].map((b) => b.key).filter((a) => userAcl.includes(a));
      study['studyShortName'] = agg['participants__study__short_name']['buckets'][0]['key'];
      study['totalFiles'] = agg['participants__study__short_name']['buckets'][0]['doc_count'];
      study['id'] = id;
      study['authorizedFiles'] = studies[id]['authorizedFiles'];

      return study;
    }),
  );
};
