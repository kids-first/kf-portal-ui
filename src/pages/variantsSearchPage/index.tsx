import React, { FC } from 'react';
import SearchView from './SearchView';
import PageContent from 'components/Layout/PageContent';
import WorkBench from './WorkBench';
import { isKfInvestigator } from 'common/profile';
import { EgoGroups } from 'store/userTypes';
import VariantStats from './VariantStats';
import './VariantSearchPage.css';

type OwnProps = {
  egoGroups: EgoGroups;
};

const VariantPage: FC<OwnProps> = ({ egoGroups }) => (
  <PageContent title={'The Kids First Variant Database'}>
    <div className={'variant-page-grid'}>
      <VariantStats />
      {isKfInvestigator(egoGroups) && <WorkBench />}
      <div className={'variant-page-grid-item-table'}>
        <SearchView />
      </div>
    </div>
  </PageContent>
);

export default VariantPage;
