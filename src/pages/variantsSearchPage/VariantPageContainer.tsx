import React, { useState } from 'react';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography } from 'antd';

import CaretDownIcon from 'icons/CaretDownIcon';
import CaretRightIcon from 'icons/CaretRightIcon';
import VariantIcon from 'icons/VariantIcon';
import history from 'services/history';

import { MappingResults, useGetPageData } from '../../store/graphql/utils/actions';
import { VARIANT_QUERY } from '../../store/graphql/variants/queries';

import VariantTableContainer from './VariantTableContainer';

import styles from './VariantPageContainer.module.scss';

const { Title } = Typography;

export type VariantPageContainerData = {
  mappingResults: MappingResults;
};

const INDEX = 'variants';
const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;

const VariantPageContainer = ({ mappingResults }: VariantPageContainerData) => {
  const [queryBuilderOpen, setQueryBuilderOpen] = useState(true);
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const { filters } = useFilters();
  const allSqons = getQueryBuilderCache('variant-repo').state;

  let results = useGetPageData(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
      first: DEFAULT_PAGE_SIZE,
      offset: DEFAULT_PAGE_SIZE * (currentPageNum - 1),
    },
    VARIANT_QUERY,
    INDEX,
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
      <div className={styles.queryBuilderTogglerContainer}>
        <div
          className={`${styles.queryBuilderToggler} ${!queryBuilderOpen && styles.togglerClosed}`}
        >
          <a className={styles.togglerIcon} onClick={() => setQueryBuilderOpen(!queryBuilderOpen)}>
            {queryBuilderOpen ? <CaretDownIcon /> : <CaretRightIcon />}
          </a>
          <Title level={1} className={styles.togglerTitle}>
            Variants Filter
          </Title>
        </div>
        <QueryBuilder
          className={`${styles.queryBuilder} ${
            !queryBuilderOpen && styles.hidden
          } variant-repo__query-builder`}
          cacheKey="variant-repo"
          enableCombine={true}
          currentQuery={filters?.content?.length ? filters : {}}
          history={history}
          loading={results.loading}
          total={total}
          dictionary={dictionary}
          IconTotal={<VariantIcon fill="#383f72" />}
        />
      </div>
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
