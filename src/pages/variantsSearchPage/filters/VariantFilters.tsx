import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';

import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';

import { generateFilters } from '../../../components/Utils/utils';
import Suggester from '../Suggester';
import SuggesterWrapper from '../SuggesterWrapper';

import { VARIANT_AGGREGATION_QUERY } from './queries';

type OwnProps = {
  mappingResults: MappingResults;
};

//TODO missing genomic location and External Ref
//order in list reflects order in UI
const INPUT_FILTER_LIST = ['variant_class', 'consequences__consequences'];
const INDEX = 'variants';
const SUGGESTION_TYPE = 'variants';
const PLACE_HOLDER_TEXT = 'chr2:g.28025382G>T';
const TITLE = 'Search by Variant';

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
      <SuggesterWrapper tooltipMessage={'Search by Variant'} title={TITLE}>
        <Suggester
          suggestionType={SUGGESTION_TYPE}
          title={TITLE}
          placeholderText={PLACE_HOLDER_TEXT}
        />
      </SuggesterWrapper>
      {results.loading ? <Spin size="large" /> : generateFilters(results, mappingResults)}
    </Layout>
  );
};

export default VariantFilters;
