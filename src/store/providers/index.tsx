import React from 'react';

import ApolloProvider from './apollo';
export interface IProvider {
  children: React.ReactNode;
  userToken: string;
}

const Provider = ({ children, userToken }: IProvider): React.ReactElement => (
  <ApolloProvider userToken={userToken}>{children}</ApolloProvider>
);

export default Provider;
