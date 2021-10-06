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
  'variant_class',
  'consequences__consequences',
  'external_reference',
  'chromosome',
  'start',
];
const SUGGESTION_TYPE = 'variants';
const PLACE_HOLDER_TEXT = 'chr2:g.28025382G>T';
const TITLE = 'Search by Variant';

const VariantFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
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
    <Layout>
      <SuggesterWrapper
        tooltipMessage={`Enter Variant Locus, Gene Symbol, Gene Alias, 
          Gene AA Change, dbSNP ID, Clinvar ID, Ensembl ID, refseq ID`}
        title={TITLE}
      >
        <Suggester
          suggestionType={SUGGESTION_TYPE}
          title={TITLE}
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
    </Layout>
  );
};

export default VariantFilters;
