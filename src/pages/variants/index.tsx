import React, { FunctionComponent } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import style from './Variants.module.scss';
import SearchView from './SearchView';
import PageContent from 'components/Layout/PageContent';
import { default as ApolloProvider } from '../../store/providers';

type VariantPageProps = {
  userToken: string;
};

const VariantPage: FunctionComponent<VariantPageProps> = ({ userToken }) => (
  <ApolloProvider userToken={userToken}>
    <PageContent title={'The Kids First Variant Database'}>
      <StackLayout className={style.statsAndZepplinContainer} center flexContent fitContent>
        {/* in construction */}
      </StackLayout>
      <SearchView />
    </PageContent>
  </ApolloProvider>
);

export default VariantPage;
