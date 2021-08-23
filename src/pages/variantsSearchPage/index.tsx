import React from 'react';

import { isKfInvestigator } from 'common/profile';
import PageContent from 'components/Layout/PageContent';

import useUser from '../../hooks/useUser';

import SearchView from './SearchView';
import VariantStats from './VariantStats';
import WorkBench from './WorkBench';

import style from './VariantsSearchPage.module.scss';

const VariantPage = () => {
  const { groups } = useUser();
  return (
    <PageContent title={'The Kids First Variant Database'}>
      <div className={style.variantPageGrid}>
        <VariantStats />
        <WorkBench isAllowed={isKfInvestigator(groups)} />
        <div className={style.variantPageGridItemTable}>
          <SearchView />
        </div>
      </div>
    </PageContent>
  );
};

export default VariantPage;
