import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';

import { generateFilters } from 'components/Utils/utils';
import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';
import { VARIANT_AGGREGATION_QUERY } from 'store/graphql/variants/queries';

import { VARIANT_INDEX, VARIANT_REPO_CACHE_KEY } from '../constants';
import Suggester from '../Suggester';
import SuggesterWrapper from '../SuggesterWrapper';

import styles from './VariantFilters.module.scss';

type OwnProps = {
  mappingResults: MappingResults;
};

//order in list reflects order in UI
const INPUT_FILTER_LIST = [
  'external_reference',
  'genes__hpo__hpo_term_label',
  'genes__orphanet__panel',
  'genes__omim__name',
  'genes__ddd__disease_name',
  'genes__cosmic__tumour_types_germline',
];
const SUGGESTION_TYPE = 'genes';
const PLACE_HOLDER_TEXT = 'chr2:g.28025382G>T';
const TITLE = 'Search by Gene';

const GeneFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const { filters } = useFilters();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  let results = useGetFilterBuckets(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
    },
    VARIANT_AGGREGATION_QUERY(INPUT_FILTER_LIST, mappingResults),
    VARIANT_INDEX,
  );

  return (
    <Layout>
      <Spin size="large" spinning={results.loading}>
        <SuggesterWrapper tooltipMessage={'Search by Gene'} title={TITLE}>
          <Suggester
          title={TITLE}
          suggestionType={SUGGESTION_TYPE}
          placeholderText={PLACE_HOLDER_TEXT}
        />
        </SuggesterWrapper>
        <Layout className={styles.variantFilterWrapper}>
          {generateFilters(results, mappingResults, styles.variantFilterContainer)}
        </Layout>
      </Spin>
    </Layout>
  );
};

export default GeneFilters;
