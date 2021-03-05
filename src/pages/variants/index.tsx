import React, { FunctionComponent } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import style from './Variants.module.scss';
import SearchView from './SearchView';
import PageContent from 'components/Layout/PageContent';

const VariantPage: FunctionComponent = () => (
  <PageContent title={'The Kids First Variant Database'}>
    <StackLayout className={style.statsAndZepplinContainer} center flexContent fitContent>
      {/* in construction */}
    </StackLayout>
    <SearchView />
  </PageContent>
);

export default VariantPage;
