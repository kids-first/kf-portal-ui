import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';

import { generateFilters } from 'components/Utils/utils';
import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';

import { VARIANT_AGGREGATION_QUERY } from '../../../store/graphql/variants/queries';
import Suggester from '../Suggester';
import SuggesterWrapper from '../SuggesterWrapper';

type OwnProps = {
  mappingResults: MappingResults;
};

//TODO External Ref
//order in list reflects order in UI
const INPUT_FILTER_LIST = [
  'genes__hpo__hpo_term_label',
  'genes__orphanet__panel',
  'genes__omim__name',
  'genes__ddd__disease_name',
  'genes__cosmic__tumour_types_germline',
];
const INDEX = 'variants';
const SUGGESTION_TYPE = 'genes';
const PLACE_HOLDER_TEXT = 'chr2:g.28025382G>T';
const TITLE = 'Search by Gene';

const GeneFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
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
      <SuggesterWrapper tooltipMessage={'Search by Gene'} title={TITLE}>
        <Suggester suggestionType={SUGGESTION_TYPE} placeholderText={PLACE_HOLDER_TEXT} />
      </SuggesterWrapper>
      {results.loading ? <Spin size="large" /> : generateFilters(results, mappingResults)}
    </Layout>
  );
};

export default GeneFilters;
