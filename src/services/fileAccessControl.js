import isObject from 'lodash/isObject';
import keys from 'lodash/keys';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import { getFenceUser } from 'services/fence';
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

export const createStudyIdSqon = studyId => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.study.external_id',
        value: [studyId],
      },
    },
  ],
});

export const createAcceptedFilesByUserStudySqon = projects => ({ sqon, studyId }) => {
  return {
    op: 'and',
    content: [
      ...(sqon ? sqon.content : []),
      { op: 'in', content: { field: 'acl', value: projects } },
      { op: 'in', content: { field: 'participants.study.external_id', value: [studyId] } },
    ],
  };
};
const createUnacceptedFilesByUserStudySqon = projects => ({ studyId, sqon }) => {
  return {
    op: 'and',
    content: [
      ...(sqon ? sqon.content : []),
      { op: 'not', content: [{ op: 'in', content: { field: 'acl', value: projects } }] },
      { op: 'in', content: { field: 'participants.study.external_id', value: [studyId] } },
    ],
  };
};

export const getUserStudyPermission = async (
  api,
  fenceConnections,
  sqon = {
    op: 'and',
    content: [],
  },
) => {
  const projects = flatten(
    Object.values(fenceConnections || {})
      .filter(fenceUser => isObject(fenceUser.projects) && keys(fenceUser.projects).length > 0)
      .map(({ projects }) => keys(projects))
      .concat('*'),
  );
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
              value: projects,
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
                  value: projects,
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
        acc[`${id}_sqon`] = createAcceptedFilesByUserStudySqon(projects)({
          studyId: id,
          sqon,
        });
        return acc;
      }, {}),
    ),
    getStudiesAggregationsFromSqon(api)(unacceptedStudyIds)(
      unacceptedStudyIds.reduce((acc, id) => {
        acc[`${id}_sqon`] = createUnacceptedFilesByUserStudySqon(projects)({
          studyId: id,
          sqon,
        });
        return acc;
      }, {}),
    ),
  ]);

  return { acceptedStudiesAggs, unacceptedStudiesAggs };
};

export const checkUserFilePermission = api => async ({ fileId, fence }) => {
  let approvedAcls;
  try {
    const userDetails = await getFenceUser(api, fence);
    approvedAcls = Object.keys(userDetails.projects);
  } catch (err) {
    // Failed to get the fence information,
    //  but we still want to allow access to open access files.
    approvedAcls = [];
  }
  return graphql(api)({
    query: `query ($sqon: JSON) {
      file {
        aggregations(filters: $sqon) {
          acl { buckets { key } }
        }
      }
    }`,
    variables: {
      sqon: {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'kf_id',
              value: [fileId],
            },
          },
        ],
      },
    },
  })
    .then(data => {
      const fileAcl = get(data, 'data.file.aggregations.acl.buckets', []).map(({ key }) => key);
      return fileAcl.some(fileAcl => fileAcl === '*' || approvedAcls.includes(fileAcl));
    })
    .catch(err => {
      console.log('err', err);
      return false;
    });
};
