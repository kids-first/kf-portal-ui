import { provideState, update } from 'freactal';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';

import { getFenceUser } from 'services/fence';
import { getUserStudyPermission } from 'services/fileAccessControl';
import { FENCES } from 'common/constants';
import { omit, flatMap, isEmpty } from 'lodash';
import { withApi } from 'services/api';

export default provideState({
  initialState: props => ({
    fenceConnectionsInitialized: false,
    fenceConnections: {},

    fenceStudiesInitialized: false,
    fenceStudies: {},
  }),
  computed: {
    fenceAuthStudies: ({ fenceStudies }) =>
      !isEmpty(fenceStudies)
        ? flatMap(Object.values(fenceStudies), studies => studies.authorizedStudies)
        : [],
    fenceNonAuthStudies: ({ fenceStudies }) =>
      !isEmpty(fenceStudies)
        ? _(fenceStudies)
            .values()
            .flatMap(studies => studies.unauthorizedStudies)
            .uniqBy('id')
            .value()
        : [],
    fenceAuthFiles: ({ fenceStudies }) =>
      _(fenceStudies)
        .map('authorizedStudies')
        .flatten()
        .reduce((acc, { id: studyId, files, studyName, studyShortName }) => {
          files.forEach(({ key }) => {
            acc.push({ fileExternalId: key, studyId, studyName, studyShortName });
          });
          return acc;
        }, []),
    fenceNonAuthFiles: ({ fenceStudies, fenceAuthFiles }) => {
      const unAuth = _(fenceStudies)
        .map('unauthorizedStudies')
        .flatten()
        .reduce((acc, { id: studyId, files, studyName, studyShortName }) => {
          files.forEach(({ key }) => {
            acc.push({ fileExternalId: key, studyId, studyName, studyShortName });
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
    addFenceStudies: update(
      (state, fence, { authorizedStudies = [], unauthorizedStudies = [] }) => {
        return {
          fenceStudies: {
            ...state.fenceStudies,
            [fence]: { authorizedStudies, unauthorizedStudies },
          },
        };
      },
    ),
    fetchFenceStudies: (effects, { api, fence, details }) => {
      return getUserStudyPermission(api, {
        [fence]: details,
      })({})
        .then(({ acceptedStudiesAggs, unacceptedStudiesAggs }) => {
          return effects.addFenceStudies(fence, {
            authorizedStudies: acceptedStudiesAggs,
            unauthorizedStudies: unacceptedStudiesAggs,
          });
        })
        .catch(err => console.log(`Error fetching fence studies for '${fence}': ${err}`));
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
