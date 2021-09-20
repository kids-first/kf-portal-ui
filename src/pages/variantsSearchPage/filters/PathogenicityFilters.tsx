import React, { FunctionComponent, useState } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Button, Layout, Spin } from 'antd';

import { generateFilters } from 'components/Utils/utils';
import { VARIANT_INDEX, VARIANT_REPO_CACHE_KEY } from 'pages/variantsSearchPage/constants';
import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';
import { VARIANT_AGGREGATION_QUERY } from 'store/graphql/variants/queries';

import styles from './VariantFilters.module.scss';

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
  const { filters } = useFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  const results = useGetFilterBuckets(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
    },
    VARIANT_AGGREGATION_QUERY(INPUT_FILTER_LIST, mappingResults),
    VARIANT_INDEX,
  );

  return (
    <>
      <div className={styles.expandButtonContainerVariant}>
        <Button onClick={() => setFiltersOpen(!filtersOpen)} type="link">
          {filtersOpen ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>
      <Spin size="large" spinning={results.loading}>
        <Layout className={styles.variantFilterWrapper}>
          {generateFilters(results, mappingResults, styles.variantFilterContainer, filtersOpen)}
        </Layout>
      </Spin>
    </>
  );
};

export default PathogenicityFilters;
