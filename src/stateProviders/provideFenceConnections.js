import { provideState, update } from 'freactal';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';
import _ from 'lodash';

import { getFenceUser } from 'services/fence';
import { getUserStudyPermission } from 'services/fileAccessControl';
import { FENCES } from 'common/constants';
import { withApi } from 'services/api';
import { flatten } from 'lodash';

export default provideState({
  initialState: props => ({
    fenceConnectionsInitialized: false,
    fenceConnections: {},

    fenceStudiesInitialized: false,
    fenceStudies: {},
    /**
     * fenceStudies: {
     *  [fence: string]: {
     *    authorizedStudies: Array<{
     *      {
     *        id: string,
     *        files: Array<{ key: string }>
     *        studyName: string,
     *        studyShortName: string,
     *      }
     *    }>
     *  }
     * }
     */
  }),
  computed: {
    fenceAcls: ({ fenceConnections }) =>
      flatten(
        Object.keys(fenceConnections).map(fence => Object.keys(fenceConnections[fence].projects)),
      ),
    fenceAuthStudies: ({ fenceStudies }) =>
      !_.isEmpty(fenceStudies)
        ? _.flatMap(Object.values(fenceStudies), studies => studies.authorizedStudies)
        : [],
    fenceNonAuthStudies: ({ fenceStudies }) =>
      !_.isEmpty(fenceStudies)
        ? _(fenceStudies)
            .values()
            .flatMap(studies => studies.unauthorizedStudies)
            .uniqBy('id')
            .value()
        : [],
    fenceAuthFiles: ({ fenceStudies }) => {
      /**
       * basically takes authorizedStudies from fenceStudies and produces
       * a flat list of studies in the format { fileExternalId, studyId, studyName, studyShortName}
       */
      return _(fenceStudies)
        .map('authorizedStudies')
        .flatten()
        .reduce((acc, { id: studyId, files, studyName, studyShortName }) => {
          files.forEach(({ key }) => {
            acc.push({
              fileExternalId: key,
              studyId,
              studyName,
              studyShortName,
            });
          });
          return acc;
        }, []);
    },
    fenceNonAuthFiles: ({ fenceStudies, fenceAuthFiles }) => {
      /**
       * same as fenceAuthFiles but with unauthorizedStudies, then find the difference
       * to fenceAuthFiles because a study may be authorized in one repo and not the other
       * so may result in duplicate
       */
      const unAuth = _(fenceStudies)
        .map('unauthorizedStudies')
        .flatten()
        .reduce((acc, { id: studyId, files, studyName, studyShortName }) => {
          files.forEach(({ key }) => {
            acc.push({
              fileExternalId: key,
              studyId,
              studyName,
              studyShortName,
            });
          });
          return acc;
        }, []);
      return _(unAuth)
        .uniqBy('fileExternalId')
        .differenceBy(fenceAuthFiles, 'fileExternalId')
        .value();
    },
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
      fenceConnections: _.omit(state.fenceConnections, fence),
      fenceStudies: _.omit(state.fenceStudies, fence),
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
    addFenceStudies: update(
      (state, fence, { authorizedStudies = [], unauthorizedStudies = [] }) => ({
        fenceStudies: {
          ...state.fenceStudies,
          [fence]: { authorizedStudies, unauthorizedStudies },
        },
      }),
    ),
    fetchFenceStudies: (effects, { api, fence, details }) => {
      return getUserStudyPermission(
        api,
        {
          [fence]: details,
        },
        undefined,
      )
        .then(({ acceptedStudiesAggs, unacceptedStudiesAggs }) =>
          effects.addFenceStudies(fence, {
            authorizedStudies: acceptedStudiesAggs,
            unauthorizedStudies: unacceptedStudiesAggs,
          }),
        )
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
