import React, { FunctionComponent, useState } from 'react';
import { Button, Layout } from 'antd';

import Suggester from 'pages/variantsSearchPage/Suggester';
import SuggesterWrapper from 'pages/variantsSearchPage/SuggesterWrapper';
import { MappingResults } from 'store/graphql/utils/actions';

import CustomFilterContainer from './CustomFilterContainer';

import styles from './VariantFilters.module.scss';

type OwnProps = {
  mappingResults: MappingResults;
};

//order in list reflects order in UI
const INPUT_FILTER_LIST = [
  'variant_class',
  'consequences__consequences',
  'variant_external_reference',
  'chromosome',
  'start',
];
const SUGGESTION_TYPE = 'variants';
const PLACE_HOLDER_TEXT = 'chr2:g.28025382G>T';
const TITLE = 'Search by Variant';

const VariantFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      <Layout className={styles.variantFilterWrapper}>
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
    </Layout>
  );
};

export default VariantFilters;
