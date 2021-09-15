import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';

import { generateFilters } from 'components/Utils/utils';
import { VARIANT_INDEX, VARIANT_REPO_CACHE_KEY } from 'pages/variantsSearchPage/constants';
import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';
import { VARIANT_AGGREGATION_QUERY } from 'store/graphql/variants/queries';

import styles from './VariantFilters.module.scss';

type OwnProps = {
  field: string;
  mappingResults: MappingResults;
};

const GenericFilters: FunctionComponent<OwnProps> = ({ field, mappingResults }) => {
  const { filters } = useFilters();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  let results = useGetFilterBuckets(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
    },
    VARIANT_AGGREGATION_QUERY([field], mappingResults),
    VARIANT_INDEX,
  );

  return (
    <Spin size="large" spinning={results.loading}>
      <Layout className={styles.variantFilterWrapper}>
        {generateFilters(results, mappingResults, styles.variantFilterContainer, true, true)}
      </Layout>
    </Spin>
  );
};

export default GenericFilters;
