import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';

import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';

import { generateFilters } from '../../../components/Utils/utils';

import { VARIANT_AGGREGATION_QUERY } from './queries';

type OwnProps = {
  mappingResults: MappingResults;
};

//TODO missing genomic location and External Ref
//order in list reflects order in UI
const INPUT_FILTER_LIST = ['variant_class', 'consequences__consequences'];
const INDEX = 'variants';

const VariantFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
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

export default VariantFilters;
