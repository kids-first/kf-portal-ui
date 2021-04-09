import React, { FC } from 'react';
import SearchView from './SearchView';
import PageContent from 'components/Layout/PageContent';
import WorkBench from './WorkBench';
import { isKfInvestigator } from 'common/profile';
import { EgoGroups } from 'store/userTypes';
import VariantStats from './VariantStats';
import style from './VariantsSearchPage.module.scss';

type OwnProps = {
  egoGroups: EgoGroups;
};

const VariantPage: FC<OwnProps> = ({ egoGroups }) => (
  <PageContent title={'The Kids First Variant Database'}>
    <div className={style.variantPageGrid}>
      <VariantStats />
      {isKfInvestigator(egoGroups) && <WorkBench />}
      <div className={style.variantPageGridItemTable}>
        <SearchView />
      </div>
    </div>
  </PageContent>
);

export default VariantPage;
