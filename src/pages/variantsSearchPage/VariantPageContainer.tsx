import React, { ReactElement, useState } from 'react';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import { ExtendedMapping } from 'components/Utils/utils';
import VariantIcon from 'icons/VariantIcon';
import history from 'services/history';
import { HitsStudiesResults } from 'store/graphql/studies/actions';
import { dotToUnderscore } from 'store/graphql/utils';
import { MappingResults, useGetPageData } from 'store/graphql/utils/actions';
import { VariantEntity } from 'store/graphql/variants/models';
import { VARIANT_QUERY } from 'store/graphql/variants/queries';
import styleThemeColors from 'style/themes/default/colors.module.scss';

import { fieldMappings } from './filters/fieldsMappings';
import GenericFilters from './filters/GenericFilters';
import { VARIANT_INDEX, VARIANT_REPO_CACHE_KEY } from './constants';
import VariantTableContainer from './VariantTableContainer';

import styles from './VariantPageContainer.module.scss';

export type VariantPageContainerData = {
  mappingResults: MappingResults;
};

export type VariantPageResults = {
  data: {
    studies: {
      hits: HitsStudiesResults;
    };
    variants: {
      hits: {
        edges: [
          {
            node: VariantEntity;
          },
        ];
        total?: number;
      };
    };
  };
  loading: boolean;
};

const DEFAULT_PAGE_NUM = 1;
export const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_STUDIES_SIZE = 30000;

const VariantPageContainer = ({ mappingResults }: VariantPageContainerData) => {
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const [currentPageSize, setcurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { filters } = useFilters();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  const results = useGetPageData(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
      pageSize: currentPageSize,
      offset: currentPageSize * (currentPageNum - 1),
      sort: [
        { field: 'max_impact_score', order: 'desc' },
        { field: 'hgvsg', order: 'asc' },
      ],
      studiesSize: DEFAULT_STUDIES_SIZE,
    },
    VARIANT_QUERY,
    VARIANT_INDEX,
  );
  const [selectedFilterContent, setSelectedFilterContent] = useState<ReactElement | undefined>(
    undefined,
  );

  const total = results.data?.variants.hits.total || 0;

  const dictionary: IDictionary = {
    query: {
      facet: (key) => {
        if (key == 'locus') return 'Variant';

        return (
          mappingResults?.extendedMapping?.find((mapping: ExtendedMapping) => key === mapping.field)
            ?.displayName || key
        );
      },
      facetValueMapping: fieldMappings,
    },
  };

  return (
    <StackLayout vertical className={styles.variantPagecontainer}>
      <QueryBuilder
        className="variant-repo__query-builder"
        showHeader={true}
        headerTitle={'Variant Query'}
        cacheKey={VARIANT_REPO_CACHE_KEY}
        enableCombine={true}
        currentQuery={filters?.content?.length ? filters : {}}
        history={history}
        loading={results.loading}
        total={total}
        dictionary={dictionary}
        facetFilterConfig={{
          enable: true,
          onFacetClick: (field) => {
            setSelectedFilterContent(
              <GenericFilters field={dotToUnderscore(field)} mappingResults={mappingResults} />,
            );
          },
          selectedFilterContent: selectedFilterContent,
          blacklistedFacets: ['genes.symbol', 'locus'],
        }}
        IconTotal={<VariantIcon fill={styleThemeColors.iconColor} />}
      />
      <StackLayout vertical className={styles.tableContainer}>
        <VariantTableContainer
          results={results}
          filters={filters}
          setCurrentPageCb={setCurrentPageNum}
          currentPageSize={currentPageSize}
          setcurrentPageSize={setcurrentPageSize}
        />
      </StackLayout>
    </StackLayout>
  );
};
export default VariantPageContainer;
