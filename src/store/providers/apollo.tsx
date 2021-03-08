import React, { ReactElement } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { kfArrangerApiRoot, arrangerApiProjectId } from 'common/injectGlobals';
import { IProvider } from 'store/providers';

import { InMemoryCache } from '@apollo/client';

const httpLink = createHttpLink({
  uri: `${kfArrangerApiRoot}${arrangerApiProjectId}/graphql`,
});

const getAuthLink = (userToken: string) =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: userToken ? `Bearer ${userToken}` : '',
    },
  }));

export default ({ children, userToken }: IProvider): ReactElement => {
  const header = getAuthLink(userToken);

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache(),
    link: header.concat(httpLink),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
