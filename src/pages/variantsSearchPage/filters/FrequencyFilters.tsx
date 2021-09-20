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
const INPUT_FILTER_LIST: string[] = [
  'frequencies__internal__upper_bound_kf__af',
  'frequencies__gnomad_genomes_2_1__af',
  'frequencies__gnomad_genomes_3_0__af',
  'frequencies__gnomad_genomes_3_1_1__af',
  'frequencies__gnomad_exomes_2_1__af',
  'frequencies__topmed__af',
  'frequencies__one_thousand_genomes__af',
];

const FrequencyFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { filters } = useFilters();
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

export default FrequencyFilters;
