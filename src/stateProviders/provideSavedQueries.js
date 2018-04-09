import { provideState, update } from 'freactal';
import urlJoin from 'url-join';

import { shortUrlApi } from 'common/injectGlobals';

export default provideState({
  initialState: props => ({
    queries: [],
    loadingQueries: false,
    deletingIds: [],
  }),
  effects: {
    setLoading: update((state, loadingQueries) => ({ loadingQueries })),
    addDeletingId: update((state, id) => ({ deletingIds: [...state.deletingIds, id] })),
    removeDeletingId: update((state, id) => ({
      deletingIds: state.deletingIds.filter(dId => dId !== id),
    })),
    getQueries: (effects, egoId) => {
      const jwt = localStorage.getItem('EGO_JWT');
      return effects
        .setLoading(true)
        .then(() => fetch(urlJoin(shortUrlApi, 'user', egoId), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        }))
        .then(result => result.json())
        .then(json => effects.setLoading(false).then(() => json))
        .then(value => state => Object.assign({}, state, { queries: value }))
    },
    deleteQuery: (effects, queryId) => {
      const jwt = localStorage.getItem('EGO_JWT');
      return effects
        .addDeletingId(queryId)
        .then(() =>
          fetch(urlJoin(shortUrlApi, queryId), {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${jwt}`
            },
          }),
      )
        .then(r => effects.removeDeletingId(queryId))
        .then(r => state => ({
          ...state,
          queries: state.queries.filter(({ id }) => id !== queryId),
        }))
    },
  },
});
