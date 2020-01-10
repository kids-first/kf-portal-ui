import { initializeApi } from 'services/api';
import { reactApiDataVersionApi } from 'common/injectGlobals';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

const getAllReleases = async options => {
  const first = (options || {}).first;
  const response = await api({
    method: 'POST',
    url: `${reactApiDataVersionApi}/graphql`,
    body: {
      query: `
       query publicReleases {
          allReleases(state:"published", orderBy: "-created_at", ${
            Number.isInteger(first) ? ` first: ${first}` : ''
          }) {   
            edges { node {
              id
              kfId
              name
              version
              state
              description
              studies{
                edges {
                  node {
                    id
                  }
                }
              }
              }}
          }
        }
      `,
    },
  });
  /** @namespace data.allReleases.edges **/
  const { data } = response;
  return data.allReleases.edges;
};

export const getLatestVersion = async () => {
  const allReleases = await getAllReleases({ first: 1 });
  return allReleases[0].node.version; // sorted
};
