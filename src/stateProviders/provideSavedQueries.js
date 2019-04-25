import { provideState, update } from 'freactal';
import urlJoin from 'url-join';

import { shortUrlApi } from 'common/injectGlobals';

export default provideState({
  initialState: props => ({
    queries: [],
    exampleQueries: [],
    loadingQueries: false,
    deletingIds: [],
  }),
  effects: {
    setLoading: update((state, loadingQueries) => ({ loadingQueries })),
    addDeletingId: update((state, id) => ({ deletingIds: [...state.deletingIds, id] })),
    removeDeletingId: update((state, id) => ({
      deletingIds: state.deletingIds.filter(dId => dId !== id),
    })),
    getQueries: (effects, { egoId, api }) => {
      return effects
        .setLoading(true)
        .then(() =>
          api({
            url: urlJoin(shortUrlApi, 'user', egoId),
            method: 'GET',
          }),
        )
        .then(value => state => {
          effects.setLoading(false);
          const queries = (value || [])
            .filter(q => !q.content.example)
            /**
             * The following filter is a stop-gap solution until Riff supports
             * tags for server-side differentiation between entity types
             */
            .filter(q => !!q.content.Files);
          const exampleQueries = (value || []).filter(q => q.content.example);
          return { ...state, queries, exampleQueries };
        });
    },
    deleteQuery: (effects, { queryId, api }) => {
      return effects
        .addDeletingId(queryId)
        .then(() =>
          api({
            url: urlJoin(shortUrlApi, queryId),
            method: 'DELETE',
          }),
        )
        .then(r => effects.removeDeletingId(queryId))
        .then(r => state => ({
          ...state,
          queries: state.queries.filter(({ id }) => id !== queryId),
          exampleQueries: state.exampleQueries.filter(({ id }) => id !== queryId),
        }));
    },
  },
});
