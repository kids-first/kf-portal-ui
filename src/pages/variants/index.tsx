import React, { FC } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import style from './Variants.module.scss';
import SearchView from './SearchView';
import PageContent from 'components/Layout/PageContent';
import WorkBench from './WorkBench';
import { isKfInvestigator } from 'common/profile';
import { EgoGroups } from 'store/userTypes';

type OwnProps = {
  egoGroups: EgoGroups;
};

const VariantPage: FC<OwnProps> = ({ egoGroups }) => (
  <PageContent title={'The Kids First Variant Database'}>
    <StackLayout className={style.statsAndZepplinContainer} center flexContent fitContent>
      {isKfInvestigator(egoGroups) && <WorkBench />}
    </StackLayout>
    <SearchView />
  </PageContent>
);

export default VariantPage;
