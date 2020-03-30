import { injectState, provideState, update } from 'freactal';
import { compose, lifecycle } from 'recompose';
import keys from 'lodash/keys';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import flatten from 'lodash/flatten';

import { getFenceUser } from 'services/fence';
import { FENCES } from 'common/constants';
import { withApi } from 'services/api';
import { graphql } from 'services/arranger';

async function getAuthStudiesIdAndCount(userAcl, fence, api) {
  return graphql(api)({
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
}

async function getStudiesCountByNameAndAcl(studies, userAcl, api) {
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
          studyId => `$${studyId}_sqon: JSON`,
        )}) {          
          file {
            ${studyIds
              .map(
                studyId => `
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
  }).then(({ data: { file } }) => {
    return studyIds.map(id => {
      let study = {};
      const agg = file[id];
      study['acl'] = agg['acl']['buckets'].map(b => b.key).filter(a => userAcl.includes(a));
      study['studyShortName'] = agg['participants__study__short_name']['buckets'][0]['key'];
      study['totalFiles'] = agg['participants__study__short_name']['buckets'][0]['doc_count'];
      study['id'] = id;
      study['authorizedFiles'] = studies[id]['authorizedFiles'];

      return study;
    });
  });
}

export default provideState({
  initialState: props => ({
    fenceConnectionsInitialized: false,
    fenceConnections: {},

    fenceStudiesInitialized: false,
    fenceStudies: [],
    /**
     * fenceStudies: {
     *  [fence: string]: {
     *    authorizedStudies: Array<{
     *      {
     *        id: string,
     *        studyName: string,
     *        studyShortName: string,
     *        totalFiles: int
     *        authorizedFiles: int
     *      }
     *    }>
     *  }
     * }
     *
     * ]
     */
  }),
  computed: {
    fenceAcls: ({ fenceConnections }) =>
      flatten(
        Object.keys(fenceConnections).map(fence => Object.keys(fenceConnections[fence].projects)),
      ),
    fenceAuthStudies: ({ fenceStudies }) =>
      !isEmpty(fenceStudies)
        ? flatMap(Object.values(fenceStudies), studies => studies.authorizedStudies)
        : [],
  },
  effects: {
    setFenceConnectionsInitialized: update(state => ({
      fenceConnectionsInitialized: true,
    })),

    clearFenceConnections: update((state, fence) => ({
      fenceConnections: {},
      fenceStudies: {},
    })),
    addFenceConnection: update((state, { fence, details }) => {
      return {
        fenceConnections: { ...state.fenceConnections, [fence]: details },
      };
    }),
    removeFenceConnection: update((state, fence) => ({
      fenceConnections: omit(state.fenceConnections, fence),
      fenceStudies: omit(state.fenceStudies, fence),
      fenceStudiesInitialized: false,
    })),
    fetchFenceConnections: (effects, { api }) => {
      const fenceConnectionsFetchArray = FENCES.map(fence =>
        getFenceUser(api, fence)
          .then(details => {
            effects.addFenceConnection({
              fence,
              details,
            });
            // Now we also need to get studies for this fence
            return effects.fetchFenceStudies({ api, fence, details });
          })
          .catch(err => console.log(`Error fetching fence connection for '${fence}': ${err}`)),
      );

      return Promise.all(fenceConnectionsFetchArray).then(() => {
        effects.setFenceConnectionsInitialized();
        effects.setFenceStudiesInitialized(false);
      });
    },

    setFenceStudiesInitialized: update((state, initialized) => ({
      fenceStudiesInitialized: initialized,
    })),
    clearFenceStudies: update(state => ({
      fenceStudies: {},
      fenceStudiesInitialized: false,
    })),
    addFenceStudies: update((state, fence, authorizedStudies) => ({
      fenceStudies: {
        ...state.fenceStudies,
        [fence]: authorizedStudies,
      },
    })),
    fetchFenceStudies: (effects, { api, fence, details }) => {
      const userAcl = Object.keys(details.projects).concat('*');
      return getAuthStudiesIdAndCount(userAcl, fence, api)
        .then(studies => {
          if (!isEmpty(studies)) return getStudiesCountByNameAndAcl(studies, userAcl, api);
          else return [];
        })
        .then(studies => {
          if (!isEmpty(studies)) {
            effects.addFenceStudies(fence, {
              authorizedStudies: studies,
            });
          }
        })
        .catch(err => console.error(`Error fetching fence studies for '${fence}': ${err}`));
    },
  },
});

export const fenceConnectionInitializeHoc = Component =>
  compose(
    injectState,
    withApi,
    lifecycle({
      async componentDidMount() {
        const {
          effects,
          api,
          state: { fenceConnectionsInitialized },
        } = this.props;
        // Only fetch connections once - don't fetch if we've done it previously
        if (!fenceConnectionsInitialized) effects.fetchFenceConnections({ api });
      },
    }),
  )(Component);
