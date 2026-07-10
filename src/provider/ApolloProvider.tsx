import { ReactElement } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import keycloak from 'auth/keycloak-api/keycloak';
import EnvironmentVariables from 'helpers/EnvVariables';
import { GraphqlBackend, GraphqlProvider } from 'provider/types';

export const ARRANGER_API = EnvironmentVariables.configFor('ARRANGER_API');
const PROJECT_ID = EnvironmentVariables.configFor('ARRANGER_PROJECT_ID');
const FHIR_API = EnvironmentVariables.configFor('FHIR_API');

export const ARRANGER_API_DOWNLOAD_URL = `${ARRANGER_API}/${PROJECT_ID}/download`;
export const ARRANGER_API_PROJECT_URL = `${ARRANGER_API}/${PROJECT_ID}/graphql`;
export const ARRANGER_API_COLUMN_STATE_URL = `${ARRANGER_API}/${PROJECT_ID}/graphql/columnsStateQuery`;

const fhirLink = createHttpLink({
  uri: `${FHIR_API}/$graphql`,
});

const arrangerLink = createHttpLink({
  uri: ARRANGER_API_PROJECT_URL,
});

const getAuthLink = () =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${keycloak.token}`,
    },
  }));

const backendUrl = (backend: GraphqlBackend) =>
  backend === GraphqlBackend.FHIR ? fhirLink : arrangerLink;

const createClient = (backend: GraphqlBackend): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: getAuthLink().concat(backendUrl(backend)),
  });

// One client (and cache) per backend, instantiated once for the whole session.
// Re-instantiating on every render would throw away the InMemoryCache, so we
// keep the client stable here. The auth link reads `keycloak.token` at request
// time, so a single client stays valid across token refreshes.
const clients = new Map<GraphqlBackend, ApolloClient<NormalizedCacheObject>>();

const getClient = (backend: GraphqlBackend): ApolloClient<NormalizedCacheObject> => {
  if (!clients.has(backend)) {
    clients.set(backend, createClient(backend));
  }
  return clients.get(backend)!;
};

const Provider = ({ children, backend = GraphqlBackend.FHIR }: GraphqlProvider): ReactElement => (
  <ApolloProvider client={getClient(backend)}>{children}</ApolloProvider>
);

export default Provider;
