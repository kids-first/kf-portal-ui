import React, { FunctionComponent, useState } from 'react';
import { Button, Layout } from 'antd';

import { MappingResults } from 'store/graphql/utils/actions';

import { VARIANT_REPO_CACHE_KEY } from '../constants';

import CustomFilterContainer from './CustomFilterContainer';

import styles from './Filters.module.scss';

type OwnProps = {
  mappingResults: MappingResults;
};

//order in list reflects order in UI
const INPUT_FILTER_LIST = [
  'clinvar__clin_sig',
  'consequences__vep_impact',
  'consequences__predictions__sift_pred',
  'consequences__predictions__polyphen2_hvar_pred',
  'consequences__predictions__fathmm_pred',
  'consequences__predictions__cadd_rankscore',
  'consequences__predictions__dann_rankscore',
  'consequences__predictions__lrt_pred',
  'consequences__predictions__revel_rankscore',
];

const PathogenicityFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <Layout>
      <div className={styles.expandButtonContainerVariant}>
        <Button onClick={() => setFiltersOpen(!filtersOpen)} type="link">
          {filtersOpen ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>
      <Layout className={styles.variantFilterWrapper}>
        {INPUT_FILTER_LIST.map((inputFilter) => (
          <CustomFilterContainer
            key={inputFilter}
            classname={styles.variantFilterContainer}
            queryBuilderId={VARIANT_REPO_CACHE_KEY}
            filterKey={inputFilter}
            mappingResults={mappingResults}
            filtersOpen={filtersOpen}
          />
        ))}
      </Layout>
    </Layout>
  );
};

export default PathogenicityFilters;
