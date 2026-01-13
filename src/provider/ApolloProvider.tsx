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

const Provider = ({ children, backend = GraphqlBackend.FHIR }: GraphqlProvider): ReactElement => {
  const header = getAuthLink();

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: header.concat(backendUrl(backend)),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Provider;
