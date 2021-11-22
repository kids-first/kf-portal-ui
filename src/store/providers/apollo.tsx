import React, { ReactElement } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import keycloak from 'keycloak';

import { arrangerApiProjectId, kfArrangerApiRoot } from 'common/injectGlobals';
import { IProvider } from 'store/providers';

const httpLink = createHttpLink({
  uri: `${kfArrangerApiRoot}${arrangerApiProjectId}/graphql`,
});

const getAuthLink = () =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: keycloak?.token ? `Bearer ${keycloak?.token}` : '',
    },
  }));

export default ({ children }: IProvider): ReactElement => {
  const header = getAuthLink();

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: header.concat(httpLink),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
