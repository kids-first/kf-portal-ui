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
    getQueries: (effects, egoId) => effects.setLoading(true),
    // .then(() => fetch(urlJoin(shortUrlApi, 'user', egoId)))
    // .then(result => result && result.json())
    // .then(({ value }) => effects.setLoading(false).then(() => value))
    // .then(value => state => Object.assign({}, state, { queries: value })),
    deleteQuery: (effects, queryId) =>
      effects
        .addDeletingId(queryId)
        .then(() =>
          fetch(urlJoin(shortUrlApi, queryId), {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json',
            },
          }),
        )
        .then(r => effects.removeDeletingId(queryId))
        .then(r => state => ({
          ...state,
          queries: state.queries.filter(({ id }) => id !== queryId),
        })),
  },
});
