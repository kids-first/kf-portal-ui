import React, { FunctionComponent, useState } from 'react';
import { Button, Layout } from 'antd';

import Suggester from 'pages/variantsSearchPage/Suggester';
import SuggesterWrapper from 'pages/variantsSearchPage/SuggesterWrapper';
import { MappingResults } from 'store/graphql/utils/actions';

import CustomFilterContainer from './CustomFilterContainer';
import FreeTextSearch from './FreeTextSearch';

import styles from './Filters.module.scss';

type OwnProps = {
  mappingResults: MappingResults;
};

//order in list reflects order in UI
const INPUT_FILTER_LIST = [
  'consequences__biotype',
  'gene_external_reference',
  'genes__cosmic__tumour_types_germline',
];

const INPUT_FILTER_LIST_FREE_TEXT = [
  'genes__hpo__hpo_term_label',
  'genes__orphanet__panel',
  'genes__omim__name',
  'genes__ddd__disease_name',
];
const SUGGESTION_TYPE = 'genes';
const PLACE_HOLDER_TEXT = 'e.g. BRAF, ENSG00000157764';
const TITLE = 'Search by Gene';

const GeneFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <Layout>
      <SuggesterWrapper
        tooltipMessage={'Enter Gene Symbol, Gene Alias or Ensembl ID'}
        title={TITLE}
      >
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
      <div>
        <Layout className={styles.variantFilterWrapperGenes}>
          {INPUT_FILTER_LIST.map((inputFilter) => (
            <CustomFilterContainer
              key={inputFilter}
              classname={styles.variantFilterContainer}
              filterKey={inputFilter}
              mappingResults={mappingResults}
              filtersOpen={filtersOpen}
            />
          ))}
        </Layout>
        <Layout className={styles.variantFilterFreeTextWrapper}>
          {INPUT_FILTER_LIST_FREE_TEXT.map((field) => (
            <FreeTextSearch key={field} field={field} mappingResults={mappingResults} />
          ))}
        </Layout>
      </div>
    </Layout>
  );
};

export default GeneFilters;
