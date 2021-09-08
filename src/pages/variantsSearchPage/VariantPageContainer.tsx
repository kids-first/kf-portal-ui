import React, { ReactElement, useState } from 'react';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import VariantIcon from 'icons/VariantIcon';
import history from 'services/history';
import { dotToUnderscore } from 'store/graphql/utils';
import { MappingResults, useGetPageData } from 'store/graphql/utils/actions';
import { VARIANT_QUERY } from 'store/graphql/variants/queries';

import GenericFilters from './filters/GenericFilters';
import { VARIANT_INDEX, VARIANT_REPO_CACHE_KEY } from './constants';
import VariantTableContainer from './VariantTableContainer';

import styles from './VariantPageContainer.module.scss';

export type VariantPageContainerData = {
  mappingResults: MappingResults;
};

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_STUDIES_SIZE = 30000;

const VariantPageContainer = ({ mappingResults }: VariantPageContainerData) => {
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const [selectedFilterContent, setSelectedFilterContent] = useState<ReactElement | undefined>(
    undefined,
  );
  const { filters } = useFilters();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;

  let results = useGetPageData(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
      pageSize: DEFAULT_PAGE_SIZE,
      offset: DEFAULT_PAGE_SIZE * (currentPageNum - 1),
      studiesSize: DEFAULT_STUDIES_SIZE,
    },
    VARIANT_QUERY,
    VARIANT_INDEX,
  );

  const total = results.data?.hits.total || 0;

  const dictionary: IDictionary = {
    query: {
      facet: (key) =>
        mappingResults?.extendedMapping?.find((mapping: any) => key === mapping.field)
          ?.displayName || key,
    },
  };

  return (
    <StackLayout vertical>
      <QueryBuilder
        className="variant-repo__query-builder"
        showHeader={true}
        headerTitle={'Variant Query'}
        showHeaderTools={true}
        cacheKey={VARIANT_REPO_CACHE_KEY}
        enableCombine={true}
        currentQuery={filters?.content?.length ? filters : {}}
        history={history}
        loading={results.loading}
        total={total}
        dictionary={dictionary}
        selectedFilterContent={selectedFilterContent}
        enableFacetFilter={true}
        onFacetClick={(field) => {
          setSelectedFilterContent(
            <GenericFilters field={dotToUnderscore(field)} mappingResults={mappingResults} />,
          );
        }}
        IconTotal={<VariantIcon fill="#383f72" />}
      />
      <StackLayout vertical className={styles.tableContainer}>
        <VariantTableContainer
          results={results}
          filters={filters}
          setCurrentPageCb={setCurrentPageNum}
        />
      </StackLayout>
    </StackLayout>
  );
};
export default VariantPageContainer;
