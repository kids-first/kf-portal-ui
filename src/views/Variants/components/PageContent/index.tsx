import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { isEmptySqon, resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Space, Typography } from 'antd';
import { ExtendedMapping, ExtendedMappingResults } from 'graphql/models';
import { useVariant } from 'graphql/variants/actions';
import { isEmpty } from 'lodash';
import OpenInNewIcon from 'components/Icons/OpenInIcon';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_QUERY_CONFIG,
  VARIANT_FILTER_TAG,
  VARIANT_REPO_QB_ID,
} from 'views/Variants/utils/constants';

import { useSavedFilter } from 'store/savedFilter';
import {
  createSavedFilter,
  deleteSavedFilter,
  setSavedFilterAsDefault,
  updateSavedFilter,
} from 'store/savedFilter/thunks';
import { combineExtendedMappings } from 'utils/fieldMapper';
import { getQueryBuilderDictionary } from 'utils/translation';

import VariantsTable from './VariantsTable';

import styles from './index.module.scss';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import { ArrangerApi } from 'services/api/arranger';
import { IVariantResultTree } from 'graphql/variants/models';
import { GET_VARIANT_COUNT } from 'graphql/variants/queries';

type OwnProps = {
  variantMapping: ExtendedMappingResults;
};

const addTagToFilter = (filter: ISavedFilter) => ({
  ...filter,
  tag: VARIANT_FILTER_TAG,
});

const PageContent = ({ variantMapping }: OwnProps) => {
  const dispatch = useDispatch();
  const { queryList, activeQuery } = useQueryBuilderState(VARIANT_REPO_QB_ID);
  const { savedFilters, defaultFilter } = useSavedFilter(VARIANT_FILTER_TAG);

  const [variantQueryConfig, setVariantQueryConfig] = useState(DEFAULT_QUERY_CONFIG);
  const variantResolvedSqon = resolveSyntheticSqon(queryList, activeQuery);

  const variantResults = useVariant({
    first: variantQueryConfig.size,
    offset: variantQueryConfig.size * (variantQueryConfig.pageIndex - 1),
    sqon: variantResolvedSqon,
    sort: isEmpty(variantQueryConfig.sort)
      ? [
          { field: 'max_impact_score', order: 'desc' },
          { field: 'hgvsg', order: 'asc' },
        ]
      : variantQueryConfig.sort,
  });

  useEffect(() => {
    setVariantQueryConfig({
      ...variantQueryConfig,
      pageIndex: DEFAULT_PAGE_INDEX,
    });
    // eslint-disable-next-line
  }, [JSON.stringify(activeQuery)]);

  const facetTransResolver = (key: string) => {
    const title = intl.get(`facets.${key}`);
    return title
      ? title
      : combineExtendedMappings([variantMapping])?.data?.find(
          (mapping: ExtendedMapping) => key === mapping.field,
        )?.displayName || key;
  };

  const handleOnUpdateFilter = (filter: ISavedFilter) => dispatch(updateSavedFilter(filter));
  const handleOnSaveFilter = (filter: ISavedFilter) =>
    dispatch(createSavedFilter(addTagToFilter(filter)));
  const handleOnDeleteFilter = (id: string) => dispatch(deleteSavedFilter(id));
  const handleOnSaveAsFavorite = (filter: ISavedFilter) =>
    dispatch(setSavedFilterAsDefault(addTagToFilter(filter)));

  return (
    <Space direction="vertical" size={24} className={styles.variantsPageContent}>
      <div className={styles.pageHeader}>
        <Typography.Title className={styles.pageHeaderTitle} level={1}>
          {intl.get('screen.variants.title')}
        </Typography.Title>
      </div>

      <QueryBuilder
        id={VARIANT_REPO_QB_ID}
        className="variants-repo__query-builder"
        headerConfig={{
          showHeader: true,
          showTools: true,
          defaultTitle: intl.get('components.querybuilder.defaultTitle'),
          options: {
            enableEditTitle: true,
            enableDuplicate: true,
            enableFavoriteFilter: false,
          },
          selectedSavedFilter: defaultFilter,
          savedFilters: savedFilters,
          onUpdateFilter: handleOnUpdateFilter,
          onSaveFilter: handleOnSaveFilter,
          onDeleteFilter: handleOnDeleteFilter,
          onSetAsFavorite: handleOnSaveAsFavorite,
        }}
        enableCombine
        enableShowHideLabels
        IconTotal={<LineStyleIcon width={18} height={18} />}
        currentQuery={isEmptySqon(activeQuery) ? {} : activeQuery}
        total={variantResults.total}
        dictionary={getQueryBuilderDictionary(facetTransResolver)}
        getResolvedQueryForCount={(sqon) => resolveSyntheticSqon(queryList, sqon)}
        fetchQueryCount={async (sqon) => {
          const { data } = await ArrangerApi.graphqlRequest<{ data: IVariantResultTree }>({
            query: GET_VARIANT_COUNT.loc?.source.body,
            variables: {
              sqon: resolveSyntheticSqon(queryList, sqon),
            },
          });

          return data?.data?.variants.hits.total ?? 0;
        }}
      />
      <VariantsTable
        results={variantResults}
        setQueryConfig={setVariantQueryConfig}
        queryConfig={variantQueryConfig}
      />
    </Space>
  );
};

export default PageContent;
