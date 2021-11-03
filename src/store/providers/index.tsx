import React from 'react';

import ApolloProvider from './apollo';

export interface IProvider {
  children: React.ReactNode;
}

type Props = {
  children: React.ReactNode;
};

const Provider = ({ children }: Props): React.ReactElement => (
  <ApolloProvider>{children}</ApolloProvider>
);

export default Provider;
