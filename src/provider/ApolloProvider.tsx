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
import { INDEXES } from 'graphql/constants';
import EnvironmentVariables from 'helpers/EnvVariables';
import { IProvider } from 'provider/types';

export const ARRANGER_API = EnvironmentVariables.configFor('ARRANGER_API');
const PROJECT_ID = EnvironmentVariables.configFor('ARRANGER_PROJECT_ID');

export const ARRANGER_API_DOWNLOAD_URL = `${ARRANGER_API}/${PROJECT_ID}/download`;
export const ARRANGER_API_PROJECT_URL = `${ARRANGER_API}/${PROJECT_ID}/graphql`;
export const ARRANGER_API_COLUMN_STATE_URL = `${ARRANGER_API}/${PROJECT_ID}/graphql/columnsStateQuery`;

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

// Each Arranger index is exposed as a root field returning an object with no id.
// Apollo cannot normalize those objects, so it replaces them wholesale on every write,
// losing sibling entries such as a hits(...) or aggregations(...) already cached under
// different arguments. A shallow merge keeps them side by side.
const rootIndexFields = Object.fromEntries(
  Object.values(INDEXES).map((index) => [index, { merge: true }]),
);

// Single client (and cache), instantiated once for the whole session so the
// InMemoryCache is not thrown away on every render.
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
    typePolicies: {
      Query: {
        fields: rootIndexFields,
      },
    },
  }),
  link: getAuthLink().concat(arrangerLink),
});

const Provider = ({ children }: IProvider): ReactElement => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default Provider;
