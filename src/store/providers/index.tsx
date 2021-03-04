import React from 'react';

import ApolloProvider from './apollo';
// import FilterProvider from './Filter';

export interface IProvider {
  children: React.ReactNode;
  userToken: string;
}

const Provider = ({ children, userToken }: IProvider): React.ReactElement => (
  <ApolloProvider userToken={userToken}>{children}</ApolloProvider>
);

export default Provider;
