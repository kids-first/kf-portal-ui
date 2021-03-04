import React, { ReactElement } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { kfArrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';
import { IProvider } from 'store/providers';

import { InMemoryCache } from '@apollo/client';

const httpLink = createHttpLink({
  uri: `${kfArrangerApiRoot}${arrangerProjectId}/graphql`,
});

const getAuthLink = (userToken: string) =>
  setContext((_, { headers }) =>
    // return the headers to the context so httpLink can read them
    ({
      headers: {
        ...headers,
        authorization: userToken ? `Bearer ${userToken}` : '',
      },
    }),
  );

const Provider2 = ({ children, userToken }: IProvider): ReactElement => {
  const header = getAuthLink(userToken);

  console.log('header : ', header);

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache(),
    link: header.concat(httpLink),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Provider2;
