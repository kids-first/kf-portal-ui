import React, { FC } from 'react';
import { default as ApolloProvider } from 'store/providers';
import Studies from './studies';

type StudiesPageProps = {
  userToken: string;
};
const StudiesPage: FC<StudiesPageProps> = ({ userToken }) => (
  <ApolloProvider userToken={userToken}>
    <Studies />
  </ApolloProvider>
);

export default StudiesPage;
