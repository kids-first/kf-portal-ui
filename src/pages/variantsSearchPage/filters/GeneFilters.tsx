import React, { FunctionComponent, useState } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Button, Layout, Spin } from 'antd';

import { generateFilters } from 'components/Utils/utils';
import { VARIANT_INDEX, VARIANT_REPO_CACHE_KEY } from 'pages/variantsSearchPage/constants';
import Suggester from 'pages/variantsSearchPage/Suggester';
import SuggesterWrapper from 'pages/variantsSearchPage/SuggesterWrapper';
import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';
import { VARIANT_AGGREGATION_QUERY } from 'store/graphql/variants/queries';

import styles from './VariantFilters.module.scss';

type OwnProps = {
  mappingResults: MappingResults;
};

//order in list reflects order in UI
const INPUT_FILTER_LIST = [
  'consequences.biotype',
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  let results = useGetFilterBuckets(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
    },
    VARIANT_AGGREGATION_QUERY(INPUT_FILTER_LIST, mappingResults),
    VARIANT_INDEX,
  );

  return (
    <>
      <SuggesterWrapper tooltipMessage={'Search by Gene'} title={TITLE}>
        <Suggester
          title={TITLE}
          suggestionType={SUGGESTION_TYPE}
          placeholderText={PLACE_HOLDER_TEXT}
        />
      </SuggesterWrapper>
      <div className={styles.expandButtonContainerVariant}>
        <Button onClick={() => setFiltersOpen(!filtersOpen)} type="link">
          {filtersOpen ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>
      <Spin size="large" spinning={results.loading}>
        <Layout className={styles.variantFilterWrapper}>
          {generateFilters(
            results,
            mappingResults,
            styles.variantFilterContainer,
            filtersOpen,
            true,
          )}
        </Layout>
      </Spin>
    </>
  );
};

export default GeneFilters;
