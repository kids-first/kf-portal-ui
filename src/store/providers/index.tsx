import React from 'react';

import useUser from '../../hooks/useUser';

import ApolloProvider from './apollo';

export interface IProvider {
  children: React.ReactNode;
  userToken: string;
}

type Props = {
  children: React.ReactNode;
};

const Provider = ({ children }: Props): React.ReactElement => {
  // if this code is reached, then userToken must be valid. Otherwise, it is most probably a bug.
  const { userToken } = useUser();
  return <ApolloProvider userToken={userToken!}>{children}</ApolloProvider>;
};

export default Provider;
