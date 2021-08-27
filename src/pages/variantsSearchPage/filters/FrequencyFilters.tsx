import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';

import { generateFilters } from 'components/Utils/utils';
import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';

import { VARIANT_AGGREGATION_QUERY } from './queries';

type OwnProps = {
  mappingResults: MappingResults;
};

//order in list reflects order in UI
const INPUT_FILTER_LIST: string[] = [
  'frequencies__internal__upper_bound_kf__af',
  'frequencies__gnomad_exomes_2_1__af',
  'frequencies__gnomad_genomes_3_0__af',
  'frequencies__gnomad_genomes_3_1_1__af',
  'frequencies__gnomad_genomes_2_1__af',
  'frequencies__topmed__af',
  'frequencies__one_thousand_genomes__af',
];
const INDEX = 'variants';

const FrequencyFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const { filters } = useFilters();

  const allSqons = getQueryBuilderCache('variant-repo').state;

  let results = useGetFilterBuckets(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
    },
    VARIANT_AGGREGATION_QUERY(INPUT_FILTER_LIST, mappingResults),
    INDEX,
  );

  return (
    <Layout>
      {results.loading ? <Spin size="large" /> : generateFilters(results, mappingResults)}
    </Layout>
  );
};

export default FrequencyFilters;
