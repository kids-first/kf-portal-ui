import { provideState, update } from 'freactal';
import _ from 'lodash';

import { getFenceUser } from 'services/fence';
import { getUserStudyPermission } from 'services/fileAccessControl';
import { FENCES } from 'common/constants';

export default provideState({
  initialState: props => ({
    fetchingFenceConnections: false,
    fenceConnections: {},

    fetchingFenceStudies: false,
    fenceStudies: {},
  }),
  effects: {
    setFetchingFenceConnections: update((state, fetchingFenceConnections) => ({
      fetchingFenceConnections,
    })),
    setFetchingFenceStudies: update((state, fetchingFenceStudies) => ({ fetchingFenceStudies })),
    addFenceConnection: update((state, { fence, details }) => {
      return {
        fenceConnections: { ...state.fenceConnections, [fence]: details },
      };
    }),
    addFenceStudies: update(
      (state, fence, { authorizedStudies = [], unauthorizedStudies = [] }) => ({
        fenceStudies: {
          ...state.fenceStudies,
          [fence]: { authorizedStudies, unauthorizedStudies },
        },
      }),
    ),
    removeFenceConnection: update((state, fence) => ({
      fenceConnections: _.omit(state.fenceConnections, fence),
      fenceStudies: _.omit(state.fenceStudies, fence),
    })),

    fetchFenceConnections: (effects, { api }) => {
      return effects.setFetchingFenceConnections(true).then(() => {
        const fenceConnectionsFetchArray = FENCES.map(fence =>
          getFenceUser(api, fence)
            .then(details => {
              effects.addFenceConnection({ fence, details });
            })
            .catch(err => console.log(`Error fetching fence connection for '${fence}': ${err}`)),
        );

        return Promise.all(fenceConnectionsFetchArray).then(values =>
          effects.setFetchingFenceConnections(false),
        );
      });
    },

    fetchFenceStudies: (effects, { api }) => {
      return effects.setFetchingFenceStudies(true).then(() => {
        const fenceStudiesFetchArray = FENCES.map(fence =>
          getUserStudyPermission(api, fence)({})
            .then(({ acceptedStudiesAggs, unacceptedStudiesAggs }) => {
              effects.addFenceStudies(fence, {
                authorizedStudies: acceptedStudiesAggs,
                unauthorizedStudies: unacceptedStudiesAggs,
              });
            })
            .catch(err => console.log(`Error fetching fence studies for '${fence}': ${err}`)),
        );

        return Promise.all(fenceStudiesFetchArray).then(values => {
          console.log('ALL DONE');
          effects.setFetchingFenceStudies(false);
        });
      });
    },
  },
});
